import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive-fill text-destructive-fill-foreground hover:bg-destructive-fill-hover focus-visible:ring-destructive-ring',
        secondary: 'border border-border bg-button-secondary text-button-secondary-foreground shadow-xs hover:bg-button-secondary-accent hover:text-button-secondary-accent-foreground',
        ghost: 'hover:bg-button-ghost-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        'default': 'h-10 px-4 py-2 has-[>svg]:px-3',
        'sm': 'h-9 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        'lg': 'h-11 rounded-md px-6 has-[>svg]:px-4',
        'icon': 'size-10',
        'icon-xs': 'size-8',
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
