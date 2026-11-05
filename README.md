# Clean Cards

Custom dashboard cards for [Home Assistant](https://www.home-assistant.io/).

## Entity card

```yaml
type: custom:clean-entity-card
entity: light.kitchen
name: Kitchen # optional
```

## Installation

- **HACS:** add this repository as a custom repository of type **Dashboard**, then download **Clean Cards**.
- **Manual:** copy `clean-cards.js` from the [latest release](https://github.com/pavelgar/clean-cards/releases/latest) to `config/www/`, and add `/local/clean-cards.js` as a JavaScript module resource.

## Development

Needs Bun, Node.js (see `.nvmrc`) and Docker or Podman. In two terminals:

```sh
bun run ha    # Home Assistant at http://localhost:8123, config in dev/ha/
bun run dev   # rebuilds dist/clean-cards.js on change and serves it to Home Assistant
```

Create an account on first start, then open the **Clean Cards** dashboard and reload it after changes. `git clean -fdX dev/ha` resets Home Assistant.

To release, set `version` in `package.json`, merge, and push a matching `v*` tag.
