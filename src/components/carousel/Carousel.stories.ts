import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { CarouselApi } from '.';
import AutoplayPlugin from 'embla-carousel-autoplay';
import { ref } from 'vue';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '.';
import { Card, CardContent } from '../card';

type EmblaApi = NonNullable<CarouselApi>;

interface OnSelectOptions {
  onSelect: (index: number) => void;
}

function selectPlugin(userOptions: OnSelectOptions) {
  let embla: EmblaApi;

  function report() {
    const index = embla.selectedScrollSnap();
    userOptions.onSelect(Number.isNaN(index) ? 0 : index);
  }

  return {
    name: 'selectPlugin',
    options: userOptions,
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

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  render: render(
    { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StoryLabel },
    `<div class="px-12">
      <div class="mx-auto max-w-sm space-y-2">
        <StoryLabel>Arrow keys or the buttons scroll one slide at a time</StoryLabel>
        <Carousel v-bind="args">
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
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const MultipleItems: Story = {
  render: render(
    { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StoryLabel },
    `<div class="px-12">
      <div class="mx-auto max-w-sm space-y-2">
        <StoryLabel>Set each item's basis to show several slides per view</StoryLabel>
        <Carousel :opts="{ align: 'start' }">
          <CarouselContent>
            <CarouselItem v-for="n in 6" :key="n" class="basis-1/3">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-3xl font-semibold">{{ n }}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>`,
  ),
};

export const Autoplay: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StoryLabel },
    setup() {
      const plugin = AutoplayPlugin({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true });
      return { plugin };
    },
    template: `<div class="px-12">
      <div class="mx-auto max-w-xs space-y-2">
        <StoryLabel>Autoplay plugin advances every 2s and pauses on hover</StoryLabel>
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
    </div>`,
  }),
};

export const CustomPlugin: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `plugins` prop accepts any custom [Embla plugin](https://www.embla-carousel.com/api/plugins/). This one hooks the Embla `select` event to report the active slide.',
      },
    },
  },
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StoryLabel },
    setup() {
      const current = ref(0);
      const plugin = selectPlugin({ onSelect: index => current.value = index });
      return { plugin, current };
    },
    template: `<div class="px-12">
      <div class="mx-auto max-w-xs space-y-2">
        <StoryLabel>Custom plugin reports the active slide — showing {{ current + 1 }} of 5</StoryLabel>
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
    </div>`,
  }),
};

export const Vertical: Story = {
  render: render(
    { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StoryLabel },
    `<div class="py-12">
      <div class="mx-auto max-w-xs space-y-2">
        <StoryLabel>Vertical orientation scrolls up and down</StoryLabel>
        <Carousel orientation="vertical" :opts="{ align: 'start' }">
          <CarouselContent class="h-75">
            <CarouselItem v-for="n in 5" :key="n" class="basis-1/2">
              <Card>
                <CardContent class="flex items-center justify-center p-6">
                  <span class="text-3xl font-semibold">{{ n }}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>`,
  ),
};
