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

## Branching on classes

A class list that branches on a named axis of the component is a `cva` in the group's `variants.ts`, not a stack of conditionals inside `cn()`.

An axis is something the component is configured or put into — `orientation`, `side`, `size`, `variant`, `position`, and flags it exposes or computes such as `wrap`, `viewOnly`, `showClear`, `removable`.

```ts
export const barVariants = cva('flex w-full items-center rounded-md border', {
  variants: {
    wrap: { true: 'min-h-10 py-1', false: 'h-10' },
    viewOnly: { true: 'text-muted-foreground', false: 'cursor-text' },
    open: { true: 'border-ring ring-[3px] ring-ring/50', false: '' },
  },
  compoundVariants: [
    { viewOnly: false, open: false, class: 'hover:border-ring/50' },
  ],
});
```

```
:class="cn(barVariants({ wrap, viewOnly, open: isOpen }), props.class)"
```

- A condition built from two flags is a `compoundVariants` entry, never a `&&` chain.
- `props.class` stays an argument to `cn()`, so tailwind-merge still lets a consumer override.
- The `variants.ts` is re-exported from `index.ts` only when the component has a public variant prop. Otherwise it stays internal, as `src/components/input-group/variants.ts` does.

A single class toggled by per-item or transient state stays inline. It names no axis, and a `cva` would cost a second file and a jump to read.

```
:class="cn('size-4', model === option.value ? 'opacity-100' : 'opacity-0')"
```

- Per item inside a `v-for` — `index === highlightedIndex`, `isSelected(option)`.
- Transient interaction state — a gesture in flight, a value not yet picked.
