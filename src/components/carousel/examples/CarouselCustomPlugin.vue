<script setup lang="ts">
import type { CarouselApi } from 'shonk-ui';
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shonk-ui';
import { ref } from 'vue';

type EmblaApi = NonNullable<CarouselApi>;

function selectPlugin(onSelect: (index: number) => void) {
  let embla: EmblaApi;

  function report() {
    const index = embla.selectedScrollSnap();
    onSelect(Number.isNaN(index) ? 0 : index);
  }

  return {
    name: 'selectPlugin',
    options: {},
    init(emblaApi: EmblaApi) {
      embla = emblaApi;
      report();
      embla.on('select', report).on('reInit', report);
    },
    destroy() {
      embla.off('select', report).off('reInit', report);
    },
  };
}

const current = ref(0);
const plugin = selectPlugin(index => current.value = index);
</script>

<template>
  <div class="space-y-2">
    <p class="text-muted-foreground text-sm">Showing {{ current + 1 }} of 5</p>

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
  </div>
</template>
