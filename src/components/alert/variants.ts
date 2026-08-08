import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Alert } from './Alert.vue';

export const alertVariants = cva(
  'flex flex-col gap-2 px-4 py-3',
  {
    variants: {
      variant: {
        default: 'bg-bg-surface text-text-primary border-current/30',
        success: 'text-text-success bg-current/10 border-current/30',
        warning: 'text-text-warning bg-current/10 border-current/30',
        destructive: 'text-text-danger bg-current/10 border-current/30',
      },
      appearance: {
        default: 'border rounded-lg',
        simple: 'border-none rounded-none',
        text: 'p-0 bg-transparent',
      },
    },
  },
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
export type AlertAppearance = NonNullable<VariantProps<typeof alertVariants>['appearance']>;
