import { cva } from 'class-variance-authority';

export const comboboxTriggerVariants = cva('w-full justify-start font-normal', {
  variants: {
    showClear: {
      true: 'pr-14',
      false: 'pr-9',
    },
    placeholder: {
      true: 'text-muted-foreground',
      false: '',
    },
  },
  defaultVariants: {
    showClear: false,
    placeholder: false,
  },
});
