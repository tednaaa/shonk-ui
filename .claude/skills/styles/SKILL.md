---
name: styles
description: Styling rules for shonk-ui. Use when writing or editing component styles, Tailwind classes, or CSS/theme variables anywhere in src.
---

# Styles

Use shadcn-vue theme tokens, via their Tailwind utilities (`bg-primary`, `text-muted-foreground`, `border-border`) or the CSS variables themselves (`var(--primary)`, `var(--muted-foreground)`).

Never hardcode a color. No hex, no `oklch(...)`, no Tailwind palette utilities like `bg-neutral-100` or `text-red-500`.

## Tokens

Surfaces come in pairs — set the surface and its foreground together:

`background`/`foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `success`, `warning`, each with a matching `-foreground`.

Standalone: `border`, `input` (form control borders), `ring` (focus rings), `chart-1`…`chart-5`, and the `sidebar-*` set.

Radius: `rounded-sm|md|lg|xl|2xl|3xl|4xl`, all derived from `--radius`.

## Rules

- Hover and active states are opacity modifiers on the base token — `hover:bg-primary/90`, not a separate token.
- Disabled states use `opacity-50`, not a disabled color token.
- `accent` is the hover/highlight surface for menu and list items; `secondary` is for secondary buttons and badges.
- Only `src/styles/theme.css` defines raw color values. It holds `:root`/`.dark` variables plus the `@theme inline` block that maps them to `--color-*`; everything else consumes them.
- `@custom-variant dark` lives in `.storybook/preview.css` — leave it there.

## Adding a token

Add the raw value to both `:root` and `.dark` in `src/styles/theme.css`, then map it in `@theme inline` as `--color-<name>: var(--<name>)`. Give it a `-foreground` partner if anything will sit on top of it. `--success` and `--warning` follow this pattern.
