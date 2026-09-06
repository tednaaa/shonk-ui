<script setup lang="ts">
import AutoplayPlugin from 'embla-carousel-autoplay';
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shonk-ui';

const plugin = AutoplayPlugin({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true });
</script>

<template>
  <Carousel :plugins="[plugin]">
    <CarouselContent>
      <CarouselItem v-for="n in 5" :key="n">
        <Card>
          <CardContent class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{{ n }}</span>
          </CardContent>
        </Card>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
