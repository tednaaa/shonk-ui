import { cva } from 'class-variance-authority';

export const filteredSearchVariants = cva(
  'flex w-full items-center gap-1.5 overflow-hidden rounded-md border border-border bg-field px-3 text-sm text-field-foreground shadow-xs transition-[color,box-shadow] outline-none',
  {
    variants: {
      wrap: {
        true: 'min-h-10 py-1',
        false: 'h-10',
      },
      viewOnly: {
        true: 'text-muted-foreground',
        false: 'cursor-text',
      },
      open: {
        true: 'border-ring ring-[3px] ring-ring/50',
        false: '',
      },
    },
    compoundVariants: [
      { viewOnly: false, open: false, class: 'hover:border-ring/50' },
    ],
    defaultVariants: {
      wrap: false,
      viewOnly: false,
      open: false,
    },
  },
);

export const filteredSearchTokenListVariants = cva('flex min-w-0 flex-1 items-center gap-1.5', {
  variants: {
    wrap: {
      true: 'flex-wrap',
      false: 'scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden',
    },
  },
  defaultVariants: {
    wrap: false,
  },
});

export const searchTokenVariants = cva(
  'inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-border bg-accent/50 pl-1.5 text-xs text-accent-foreground',
  {
    variants: {
      removable: {
        true: 'pr-1',
        false: 'pr-1.5',
      },
    },
    defaultVariants: {
      removable: true,
    },
  },
);

export const filterTokenVariants = cva(
  'inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-border bg-accent/50 pl-2 text-xs text-accent-foreground',
  {
    variants: {
      removable: {
        true: 'pr-1',
        false: 'pr-2',
      },
    },
    defaultVariants: {
      removable: true,
    },
  },
);
