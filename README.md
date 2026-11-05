# Clean Cards

Custom dashboard cards for [Home Assistant](https://www.home-assistant.io/).

## Cards

### Entity card

Shows an entity's name and its current state.

```yaml
type: custom:clean-entity-card
entity: light.kitchen
name: Kitchen # optional, defaults to the entity's name
```

## Installation

### HACS

1. In HACS, open the menu in the top right and choose **Custom repositories**.
2. Add `https://github.com/pavelgar/clean-cards` with the type **Dashboard**.
3. Find **Clean Cards** in HACS and download it.
4. Reload the browser tab.

### Manual

1. Download `clean-cards.js` from the [latest release](https://github.com/pavelgar/clean-cards/releases/latest).
2. Copy it to `config/www/` in your Home Assistant configuration.
3. Go to **Settings → Dashboards**, open the menu in the top right and choose **Resources**.
4. Add `/local/clean-cards.js` as a **JavaScript module**.

## Development

You need [Bun](https://bun.sh/), Node.js (version in `.nvmrc`), and Podman or Docker.

```sh
bun install
bun run ha     # start a local Home Assistant at http://localhost:8123
bun run dev    # serve the cards to it
```

`bun run ha` runs Home Assistant in a container, with its config in `.ha/`.
On the first start it completes onboarding, adds the dev server as a dashboard
resource, and creates a **Clean Cards** dashboard (`/clean-cards`) that shows each card next to the built-in
tile card. Log in as `dev` / `dev`. The demo integration provides the entities.

After you change a card, reload the dashboard to see it. Cards can't be
swapped in place, because a custom element can't be redefined.

Other commands:

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `bun run ha stop` | Stop the local Home Assistant                      |
| `bun run ha logs` | Follow its logs                                    |
| `bun run test`    | Run the tests (`bun run test:watch` to keep going) |
| `bun run lint`    | Lint                                               |
| `bun run format`  | Format with Prettier                               |
| `bun run build`   | Type-check and build `dist/clean-cards.js`         |
| `bun run watch`   | Rebuild `dist/` on every change                    |

To start Home Assistant from scratch, stop it, remove the container
(`podman rm clean-cards-ha`) and delete `.ha/`.

### Releasing

1. Set `version` in `package.json` and merge that to `main`.
2. Tag the commit with the same version, e.g. `git tag v0.1.0 && git push --tags`.

The release workflow checks the tag matches, builds, and attaches
`clean-cards.js` to a GitHub release, which is what HACS installs.
