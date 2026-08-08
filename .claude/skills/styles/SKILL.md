---
name: styles
description: Styling rules for shonk-ui. Use when writing or editing component styles, Tailwind classes, or CSS/theme variables anywhere in src.
---

# Styles

Always use semantic alias CSS variables (e.g. `--color-text-primary`, `--color-bg-brand`, `--color-border-default`) or their Tailwind equivalents (e.g. `text-text-primary`, `bg-bg-brand`).

Never use primitive variables directly (anything prefixed `--primitive-`). Primitives are only for defining semantic aliases in `theme.css`.
