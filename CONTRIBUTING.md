# Contributing

## Development

```bash
pnpm docs:dev
pnpm build && pnpm validate:themes
```

## Component layout

A component folder keeps the main component, `index.ts`, `types.ts`, `_examples/` and stories at its root. The rest depends on its size.

### Small components
- `ui/` — the other components
- `composables/` — public `use*` with their specs
- `lib/` — internals

### Components with several features
- When `ui/`, `lib/` and `composables/` would mix parts of several features, each feature gets its own folder instead: `data-table/column-visibility/` holds `DataTableColumnToggle.vue` and `useStoredColumnVisibility.ts`.
- A feature folder is flat: its components, composables, internals and specs side by side.
- `core/` holds what every feature builds on.

## Release

```fish
cargo install relkit
relkit
```
