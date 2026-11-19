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

### Styles
- Tailwind in the markup for layout, spacing, colors and type.
- Heavy behavior — sticky stacks, pseudo-element layers, `calc` offsets — goes to a CSS file per component: `src/styles/components/data-table.css`.
- Its rules sit inside `@layer components` and select by `[data-slot="..."]` or `data-*` state attributes, so a consumer's `class` and unlayered `[data-slot]` rules still win.
- Import the file in `src/styles/main.css`, the only CSS the package ships, and in `.storybook/preview.css`.
- No `<style>` or `<style module>` in components.
- Colors are theme variables such as `var(--border)`, never raw values.

## Release

```fish
cargo install relkit
relkit
```
