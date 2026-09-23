<script setup lang="ts">
import type { WithClassAsProps } from './interface';
import type { ButtonVariants } from '@/components/button';
import { ArrowLeft } from '@lucide/vue';
import { Button } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { useCarousel } from './useCarousel';
import { carouselPreviousVariants } from './variants';

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

const { orientation, canScrollPrev, scrollPrev } = useCarousel();
</script>

<template>
  <Button
    data-slot="carousel-previous"
    :disabled="!canScrollPrev"
    :class="cn(carouselPreviousVariants({ orientation }), props.class)"
    :variant="variant"
    :size="size"
    @click="scrollPrev"
  >
    <slot>
      <ArrowLeft />
      <span class="sr-only">{{ props.screenReaderText ?? locale.carousel.previousButtonScreenReaderText }}</span>
    </slot>
  </Button>
</template>
