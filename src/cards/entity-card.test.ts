import type { HassEntity } from "home-assistant-js-websocket";
import { afterEach, describe, expect, it, vi } from "vitest";
import "../clean-cards";
import type { HomeAssistant } from "home-assistant-frontend-types";
import type { CleanEntityCard } from "./entity-card";

const TYPE = "custom:clean-entity-card";

function entity(entity_id: string, state: string, friendly_name?: string) {
  return {
    entity_id,
    state,
    attributes: friendly_name ? { friendly_name } : {},
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  } satisfies HassEntity;
}

function fakeHass(...entities: HassEntity[]): HomeAssistant {
  return {
    states: Object.fromEntries(entities.map((e) => [e.entity_id, e])),
    language: "en",
    formatEntityState: (stateObj: HassEntity) => `${stateObj.state}!`,
  } as unknown as HomeAssistant;
}

async function mount(card: CleanEntityCard) {
  document.body.append(card);
  await card.updateComplete;
  return card.shadowRoot!;
}

describe("clean-entity-card", () => {
  afterEach(() => document.body.replaceChildren());

  it("is registered and listed in the card picker", () => {
    expect(customElements.get("clean-entity-card")).toBeDefined();
    expect(window.customCards).toContainEqual(
      expect.objectContaining({ type: "clean-entity-card" }),
    );
  });

  it("rejects a config without an entity", () => {
    const card = document.createElement("clean-entity-card");
    expect(() => card.setConfig({ type: TYPE } as never)).toThrow(/entity/);
  });

  it("shows the friendly name and formatted state", async () => {
    const card = document.createElement("clean-entity-card");
    card.setConfig({ type: TYPE, entity: "light.kitchen" });
    card.hass = fakeHass(entity("light.kitchen", "on", "Kitchen"));

    const root = await mount(card);
    expect(root.querySelector(".name")?.textContent).toBe("Kitchen");
    expect(root.querySelector(".state")?.textContent).toBe("on!");
  });

  it("prefers the configured name", async () => {
    const card = document.createElement("clean-entity-card");
    card.setConfig({ type: TYPE, entity: "light.kitchen", name: "Lamp" });
    card.hass = fakeHass(entity("light.kitchen", "on", "Kitchen"));

    const root = await mount(card);
    expect(root.querySelector(".name")?.textContent).toBe("Lamp");
  });

  it("warns when the entity doesn't exist", async () => {
    const card = document.createElement("clean-entity-card");
    card.setConfig({ type: TYPE, entity: "light.missing" });
    card.hass = fakeHass();

    const root = await mount(card);
    expect(root.querySelector(".warning")?.textContent).toContain(
      "light.missing",
    );
  });

  it("re-renders only when its own entity changes", async () => {
    const card = document.createElement("clean-entity-card");
    card.setConfig({ type: TYPE, entity: "light.kitchen" });
    const kitchen = entity("light.kitchen", "on");
    card.hass = fakeHass(kitchen, entity("light.hall", "off"));
    const root = await mount(card);
    const render = vi.spyOn(card as unknown as { render(): unknown }, "render");

    card.hass = fakeHass(kitchen, entity("light.hall", "on"));
    await card.updateComplete;
    expect(render).not.toHaveBeenCalled();

    card.hass = fakeHass(entity("light.kitchen", "off"));
    await card.updateComplete;
    expect(render).toHaveBeenCalledOnce();
    expect(root.querySelector(".state")?.textContent).toBe("off!");
  });
});
