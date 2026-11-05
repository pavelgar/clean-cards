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

You need [Bun](https://bun.sh/), Node.js (version in `.nvmrc`), and Docker or
Podman (as `docker`). Run these in two terminals:

```sh
bun install
bun run ha     # local Home Assistant at http://localhost:8123 (Ctrl+C stops it)
bun run dev    # builds the cards on every change and serves them to it
```

`bun run ha` runs Home Assistant in a container with `dev/ha/` as its config
folder. The committed `configuration.yaml` loads the demo integration for test
entities, loads the built cards from `http://localhost:4000/clean-cards.js` on
every page (`frontend: extra_module_url`), and adds a **Clean Cards**
dashboard (`dev/ha/dashboards/clean-cards.yaml`) that shows each card next to
the built-in tile card.

The first time, open http://localhost:8123 and create an account. Home
Assistant keeps it, and everything else it writes, in `dev/ha/` (gitignored).
To start from scratch, run `git clean -fdX dev/ha`.

`bun run dev` runs `vite build --watch` and `vite preview` together, so Home
Assistant always loads the same bundle a release would ship. After you change a
card or the dashboard file, reload the page to see it.
Cards can't be swapped in place, because a custom element can't be redefined.

Other commands:

| Command          | What it does                                       |
| ---------------- | -------------------------------------------------- |
| `bun run test`   | Run the tests (`bun run test:watch` to keep going) |
| `bun run lint`   | Lint                                               |
| `bun run format` | Format with Prettier                               |
| `bun run build`  | Type-check and build `dist/clean-cards.js`         |

Types for Home Assistant's frontend (`hass`, cards, the card picker) are copied
from its source into `src/ha/`; see `src/ha/README.md` for where from and how to
add more.

### Releasing

1. Set `version` in `package.json` and merge that to `main`.
2. Tag the commit with the same version, e.g. `git tag v0.1.0 && git push --tags`.

The release workflow checks the tag matches, builds, and attaches
`clean-cards.js` to a GitHub release, which is what HACS installs.
