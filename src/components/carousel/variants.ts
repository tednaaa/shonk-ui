import { cva } from 'class-variance-authority';

export const carouselContentVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: '-ml-4',
      vertical: '-mt-4 flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const carouselItemVariants = cva('min-w-0 shrink-0 grow-0 basis-full', {
  variants: {
    orientation: {
      horizontal: 'pl-4',
      vertical: 'pt-4',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const carouselPreviousVariants = cva('absolute size-8 rounded-full', {
  variants: {
    orientation: {
      horizontal: 'top-1/2 -left-12 -translate-y-1/2',
      vertical: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const carouselNextVariants = cva('absolute size-8 rounded-full', {
  variants: {
    orientation: {
      horizontal: 'top-1/2 -right-12 -translate-y-1/2',
      vertical: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
