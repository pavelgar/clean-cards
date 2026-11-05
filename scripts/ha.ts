// Runs a throwaway Home Assistant in a container for developing the cards.
//
//   bun run ha [start]   start it, onboard it and add a test dashboard
//   bun run ha stop
//   bun run ha logs
//
// Its config lives in .ha/ (gitignored); delete that folder to start over.
// Uses podman if it's installed, otherwise docker; set CONTAINER_RUNTIME to
// pick one explicitly.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  createConnection,
  createLongLivedTokenAuth,
  type Connection,
  type HassEntities,
} from "home-assistant-js-websocket";

const CONTAINER = "clean-cards-ha";
const IMAGE = "ghcr.io/home-assistant/home-assistant:stable";
const HA_URL = "http://localhost:8123";
const CLIENT_ID = `${HA_URL}/`;
const RESOURCE_URL = "http://localhost:5173/src/clean-cards.ts";
const DASHBOARD = "clean-cards";
// Login for the local dev instance only. It never leaves this machine.
const USERNAME = "dev";
const PASSWORD = "dev";

const root = resolve(import.meta.dirname, "..");
const configDir = resolve(root, ".ha");

const runtime =
  process.env.CONTAINER_RUNTIME ??
  (spawnSync("podman", ["--version"]).status === 0 ? "podman" : "docker");

function container(args: string[], opts: { quiet?: boolean } = {}) {
  const result = spawnSync(runtime, args, {
    stdio: opts.quiet ? "ignore" : "inherit",
  });
  return result.status === 0;
}

function startContainer() {
  if (!existsSync(resolve(configDir, "configuration.yaml"))) {
    mkdirSync(configDir, { recursive: true });
    copyFileSync(
      resolve(root, "dev/ha/configuration.yaml"),
      resolve(configDir, "configuration.yaml"),
    );
  }

  if (container(["container", "inspect", CONTAINER], { quiet: true })) {
    if (!container(["start", CONTAINER])) process.exit(1);
    return;
  }
  const ok = container([
    "run",
    "--detach",
    "--name",
    CONTAINER,
    "--publish",
    "8123:8123",
    "--volume",
    `${configDir}:/config:Z`,
    "--env",
    `TZ=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    IMAGE,
  ]);
  if (!ok) process.exit(1);
}

async function api<T>(
  path: string,
  init: { body?: unknown; form?: Record<string, string>; token?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.token) headers.Authorization = `Bearer ${init.token}`;
  let body: string | undefined;
  if (init.form) {
    body = new URLSearchParams(init.form).toString();
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else if (init.body !== undefined) {
    body = JSON.stringify(init.body);
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${HA_URL}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body,
  });
  if (!res.ok) {
    throw new Error(`${path}: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

type OnboardingStep = { step: string; done: boolean };

async function waitForHomeAssistant(): Promise<OnboardingStep[]> {
  process.stdout.write("Waiting for Home Assistant");
  const deadline = Date.now() + 5 * 60_000;
  while (Date.now() < deadline) {
    try {
      const steps = await api<OnboardingStep[]>("/api/onboarding");
      process.stdout.write(" ready\n");
      return steps;
    } catch {
      process.stdout.write(".");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error(`Home Assistant didn't come up; see \`bun run ha logs\`.`);
}

async function logIn(): Promise<string> {
  const flow = await api<{ flow_id: string }>("/auth/login_flow", {
    body: {
      client_id: CLIENT_ID,
      handler: ["homeassistant", null],
      redirect_uri: CLIENT_ID,
    },
  });
  const step = await api<{ type: string; result?: string }>(
    `/auth/login_flow/${flow.flow_id}`,
    { body: { client_id: CLIENT_ID, username: USERNAME, password: PASSWORD } },
  );
  if (step.type !== "create_entry" || !step.result) {
    throw new Error(
      `Couldn't log in as "${USERNAME}". If you changed the password, ` +
        `update scripts/ha.ts or delete .ha/ to start over.`,
    );
  }
  const token = await api<{ access_token: string }>("/auth/token", {
    form: {
      grant_type: "authorization_code",
      code: step.result,
      client_id: CLIENT_ID,
    },
  });
  return token.access_token;
}

async function onboard(steps: OnboardingStep[]): Promise<string> {
  const pending = new Set(steps.filter((s) => !s.done).map((s) => s.step));
  if (pending.has("user")) {
    await api("/api/onboarding/users", {
      body: {
        client_id: CLIENT_ID,
        name: "Developer",
        username: USERNAME,
        password: PASSWORD,
        language: "en",
      },
    });
  }
  const token = await logIn();
  if (pending.has("core_config")) {
    await api("/api/onboarding/core_config", { token, body: {} });
  }
  if (pending.has("analytics")) {
    await api("/api/onboarding/analytics", { token, body: {} });
  }
  if (pending.has("integration")) {
    await api("/api/onboarding/integration", {
      token,
      body: { client_id: CLIENT_ID, redirect_uri: CLIENT_ID },
    });
  }
  return token;
}

async function ensureResource(conn: Connection) {
  const resources = await conn.sendMessagePromise<{ url: string }[]>({
    type: "lovelace/resources",
  });
  if (resources.some((r) => r.url === RESOURCE_URL)) return;
  await conn.sendMessagePromise({
    type: "lovelace/resources/create",
    res_type: "module",
    url: RESOURCE_URL,
  });
}

// A "Clean Cards" dashboard that puts each card next to the built-in tile
// card for the same entities. Only filled in once: after that it's yours
// to edit, and later starts leave it alone.
async function ensureDashboard(conn: Connection) {
  const dashboards = await conn.sendMessagePromise<{ url_path: string }[]>({
    type: "lovelace/dashboards/list",
  });
  if (!dashboards.some((d) => d.url_path === DASHBOARD)) {
    await conn.sendMessagePromise({
      type: "lovelace/dashboards/create",
      url_path: DASHBOARD,
      title: "Clean Cards",
      icon: "mdi:card-outline",
      show_in_sidebar: true,
      require_admin: false,
      mode: "storage",
    });
  }

  try {
    await conn.sendMessagePromise({
      type: "lovelace/config",
      url_path: DASHBOARD,
    });
    return;
  } catch {
    // Nothing saved yet.
  }

  const states = await conn.sendMessagePromise<HassEntities[string][]>({
    type: "get_states",
  });
  const firstOf = (domain: string, attribute?: string) =>
    states.find(
      (s) =>
        s.entity_id.startsWith(`${domain}.`) &&
        (!attribute || attribute in s.attributes),
    )?.entity_id;
  const entities = [
    "input_boolean.dev_toggle",
    "input_number.dev_level",
    firstOf("light"),
    firstOf("sensor", "unit_of_measurement"),
    firstOf("climate"),
    firstOf("media_player"),
  ].filter((e): e is string => !!e);

  const section = (heading: string, type: string) => ({
    type: "grid",
    cards: [
      { type: "heading", heading },
      ...entities.map((entity) => ({ type, entity })),
    ],
  });

  await conn.sendMessagePromise({
    type: "lovelace/config/save",
    url_path: DASHBOARD,
    config: {
      views: [
        {
          title: "Clean Cards",
          type: "sections",
          sections: [
            section("clean-entity-card", "custom:clean-entity-card"),
            section("Tile (built in)", "tile"),
          ],
        },
      ],
    },
  });
}

async function start() {
  startContainer();
  const steps = await waitForHomeAssistant();
  const token = await onboard(steps);

  const conn = await createConnection({
    auth: createLongLivedTokenAuth(HA_URL, token),
  });
  try {
    await ensureResource(conn);
    await ensureDashboard(conn);
  } finally {
    conn.close();
  }

  console.log(`
Home Assistant is running at ${HA_URL}/${DASHBOARD} (log in as ${USERNAME} / ${PASSWORD}).
Run \`bun run dev\` so it can load the cards from ${RESOURCE_URL},
then reload the dashboard after each change.`);
}

const command = process.argv[2] ?? "start";
switch (command) {
  case "start":
    await start();
    break;
  case "stop":
    container(["stop", CONTAINER]);
    break;
  case "logs":
    container(["logs", "--follow", CONTAINER]);
    break;
  default:
    console.error(`Unknown command "${command}". Use start, stop or logs.`);
    process.exit(1);
}
