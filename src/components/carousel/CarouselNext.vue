<script setup lang="ts">
import type { WithClassAsProps } from './interface';
import type { ButtonVariants } from '@/components/button';
import { ArrowRight } from '@lucide/vue';
import { Button } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { useCarousel } from './useCarousel';
import { carouselNextVariants } from './variants';

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
    :class="cn(carouselNextVariants({ orientation }), props.class)"
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
