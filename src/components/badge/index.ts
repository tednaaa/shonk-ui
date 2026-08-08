import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Badge } from './Badge.vue';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px] aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-bg-brand text-text-inverse [a&]:hover:bg-bg-brand/90',
        secondary:
          'border-transparent bg-bg-subtle text-text-secondary [a&]:hover:bg-bg-subtle/90',
        destructive:
         'border-transparent bg-bg-danger text-white [a&]:hover:bg-bg-danger/90 focus-visible:ring-border-danger/20 dark:focus-visible:ring-border-danger/40 dark:bg-bg-danger/60',
        outline:
          'text-text-primary [a&]:hover:bg-bg-brand-subtle [a&]:hover:text-text-brand',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
