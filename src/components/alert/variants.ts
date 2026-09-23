import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'flex flex-col gap-2 px-4 py-3',
  {
    variants: {
      variant: {
        default: 'border-current/30 bg-card text-card-foreground',
        success: 'border-current/30 bg-current/10 text-success',
        warning: 'border-current/30 bg-current/10 text-warning',
        destructive: 'border-current/30 bg-current/10 text-destructive',
      },
      appearance: {
        default: 'rounded-lg border',
        simple: 'rounded-none border-none',
        text: 'bg-transparent p-0',
      },
    },
  },
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
export type AlertAppearance = NonNullable<VariantProps<typeof alertVariants>['appearance']>;
