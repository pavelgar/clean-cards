# Home Assistant frontend types

Types copied from the [Home Assistant frontend](https://github.com/home-assistant/frontend)
at commit `5cfdff0e21690256ea780efc76f354f6c1f0c3a1`, licensed under Apache-2.0
(see `LICENSE.md`). The frontend doesn't publish its types, so custom cards copy them.

Each file mirrors the path of its source in the frontend repo, e.g. `src/ha/types.ts`
comes from `src/types.ts`. Changes from the originals:

- Only the types and members our cards use are kept. To use something else, copy it
  over from the same file at a newer commit and update the commit above.
- Imports use our `@/ha/…` alias, and the files are formatted with our Prettier config.
