<script setup lang="ts">
import type { WithClassAsProps } from './interface';
import type { ButtonVariants } from '@/components/button';
import { ArrowRight } from '@lucide/vue';
import { Button } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { useCarousel } from './useCarousel';

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  screenReaderText?: string;
}
& WithClassAsProps>(), {
  variant: 'outline',
  size: 'icon',
});

const locale = useLocale();

const { orientation, canScrollNext, scrollNext } = useCarousel();
</script>

<template>
  <Button
    data-slot="carousel-next"
    :disabled="!canScrollNext"
    :class="cn(
      'absolute size-8 rounded-full',
      orientation === 'horizontal'
        ? 'top-1/2 -right-12 -translate-y-1/2'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class,
    )"
    :variant="variant"
    :size="size"
    @click="scrollNext"
  >
    <slot>
      <ArrowRight />
      <span class="sr-only">{{ props.screenReaderText ?? locale.carousel.nextButtonScreenReaderText }}</span>
    </slot>
  </Button>
</template>
