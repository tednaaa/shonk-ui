import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px] aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger',
  {
    variants: {
      variant: {
        default: 'bg-bg-brand text-text-inverse hover:bg-bg-brand/90',
        destructive: 'bg-bg-danger text-white hover:bg-bg-danger/90 focus-visible:ring-border-danger/20 dark:focus-visible:ring-border-danger/40 dark:bg-bg-danger/60',
        outline: 'border bg-bg-surface shadow-xs hover:bg-bg-brand-subtle hover:text-text-brand dark:bg-bg-muted/30 dark:border-border-default dark:hover:bg-bg-muted/50',
        secondary: 'bg-bg-subtle text-text-secondary hover:bg-bg-subtle/80',
        ghost: 'hover:bg-bg-brand-subtle hover:text-text-brand dark:hover:bg-bg-brand-subtle/50',
        link: 'text-text-brand underline-offset-4 hover:underline',
      },
      size: {
        'default': 'h-10 px-4 py-2 has-[>svg]:px-3',
        'sm': 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        'lg': 'h-11 rounded-md px-6 has-[>svg]:px-4',
        'icon': 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
    compoundVariants: [
      {
        variant: 'link',
        class: 'h-auto p-0 has-[>svg]:p-0',
      },
    ],
  },
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;
