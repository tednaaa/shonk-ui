<script setup lang="ts">
import type { WithClassAsProps } from './interface';
import { cn } from '@/utils';
import { useCarousel } from './useCarousel';
import { carouselItemVariants } from './variants';

const props = defineProps<WithClassAsProps>();

const { orientation } = useCarousel();
</script>

<template>
  <div
    data-slot="carousel-item"
    role="group"
    aria-roledescription="slide"
    :class="cn(carouselItemVariants({ orientation }), props.class)"
  >
    <slot />
  </div>
</template>
