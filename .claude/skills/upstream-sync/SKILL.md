---
name: upstream-sync
description: Check shadcn-vue for updates to the components shonk-ui vendored and for components it added since. Use when asked to sync with shadcn-vue, check upstream updates or new upstream components, or port an upstream change.
---

# Upstream sync

`pnpm upstream` keeps a partial clone of shadcn-vue in `node_modules/.cache/shadcn-vue` and reads `scripts/upstream/upstream.json`:

- `vendored` — shonk-ui groups copied from `apps/v4/registry/new-york-v4/ui`, each with the upstream commit it was last synced to, and `from` when the upstream name differs (`toast` from `sonner`)
- `skipped` — upstream components deliberately not taken, with the reason

Groups absent from both are shonk-ui's own (`filtered-search`, `data-table`, `confirm-dialog`…) and are never compared.

## Commands

- `pnpm upstream` — commits touching each vendored group since its ref, then upstream components not yet vendored or skipped
- `pnpm upstream diff [name...]` — upstream diff since the ref
- `pnpm upstream show <name>` — upstream files of a component
- `pnpm upstream synced [name...]` — move refs to the current upstream head
- `pnpm upstream track <name> [from]` — start vendoring
- `pnpm upstream skip <name> <reason>` — stop listing an upstream component as new

## Changed components

1. `pnpm upstream diff <name>` and sort each hunk:
   - noise — import paths, quotes, formatting, class canonicalisation shonk-ui already has
   - real — behaviour, markup, props, classes
2. Report to the user per group: noise only, or the real change in one line. Port nothing before the user picks.
3. Port a picked change by hand into `src/components/<name>`; never copy upstream files over, shonk-ui files carry its own changes.
4. `pnpm upstream synced <name>` once a group is reviewed, ported or not.

## New components

1. `pnpm upstream show <name>` for each, and report one line per component: what it is, which shonk-ui group overlaps it.
2. Add nothing without the user's go. Declined → `pnpm upstream skip <name> <reason>`.
3. Taken → `pnpm upstream track <name>`, port into `src/components/<name>`, export it from `src/index.ts`, write stories with the `write-stories` skill.

## Porting

- `import { cn } from "cn"` or `"@/lib/utils"` → `import { cn } from '@/utils'`
- `@/registry/new-york-v4/ui/<group>` → `'../<group>'`
- Quotes and indent → `pnpm exec eslint --fix <files>`
- Colors follow the `styles` skill: theme tokens only

## Known divergences

Keep these when an upstream hunk touches them:

- `tooltip` — `bg-primary text-primary-foreground` content; `Tooltip` takes `content`, `side`, `contentClass` and brings its own provider
- `kbd` — inside tooltip content takes `primary-foreground` tones, following the `bg-primary` tooltip
- `toggle` — `outline` hovers on `bg-muted`, not the `bg-accent` of the pressed state
- `attachment`, `trace`, `code-block` — `animate-pulse` for in-progress titles, a group without the scroll fade: upstream `shimmer` and `scroll-fade-*` live in its docs-site CSS, not the registry
- `message-scroller` — viewport and button copy come from the `messageScroller` locale; section comments dropped, the three explanatory ones kept as `NOTE:` lines
- `code-block` — copy button text comes from the `codeBlock` locale; the destructive line and variant use `destructive-subtle` and a solid `destructive` border
- every button in the kit renders `type="button"`

Add a line here when a port deliberately keeps shonk-ui's version.

## Commits

- A ported change is one commit per group, `feat(<group>): …` or `fix(<group>): …` describing the change itself, with its `upstream.json` ref in the same commit.
- Refs moved without a port go together in one `chore(upstream): mark <groups> synced`.
