import { cva } from 'class-variance-authority';

export const selectContentVariants = cva(
  'relative z-50 max-h-80 min-w-32 overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
  {
    variants: {
      position: {
        'popper': 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        'item-aligned': '',
      },
    },
    defaultVariants: {
      position: 'popper',
    },
  },
);

export const selectViewportVariants = cva('p-1', {
  variants: {
    position: {
      'popper': 'h-(--reka-select-trigger-height) w-full min-w-(--reka-select-trigger-width) scroll-my-1',
      'item-aligned': '',
    },
  },
  defaultVariants: {
    position: 'popper',
  },
});

export const selectTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-sm border border-border bg-field px-3 py-2 text-sm whitespace-nowrap text-field-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive-ring data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4 [&_svg:not([class*=text-])]:text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'h-9',
        md: 'h-10',
      },
      showClear: {
        true: 'pr-16',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      showClear: false,
    },
  },
);

export const selectTriggerIconVariants = cva('size-4 opacity-50', {
  variants: {
    showClear: {
      true: 'absolute top-1/2 right-3 -translate-y-1/2',
      false: '',
    },
  },
  defaultVariants: {
    showClear: false,
  },
});
