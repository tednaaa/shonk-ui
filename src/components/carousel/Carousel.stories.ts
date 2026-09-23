import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, showControls, StorybookLabel } from '@/lib/storybook';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '.';
import { Card, CardContent } from '../card';
import CarouselAutoplay from './examples/CarouselAutoplay.vue';
import carouselAutoplaySource from './examples/CarouselAutoplay.vue?raw';
import CarouselCustomPlugin from './examples/CarouselCustomPlugin.vue';
import carouselCustomPluginSource from './examples/CarouselCustomPlugin.vue?raw';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  render: render(
    { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StorybookLabel },
    `<div class="px-12">
      <div class="mx-auto max-w-sm space-y-2">
        <StorybookLabel>Arrow keys or the buttons scroll one slide at a time</StorybookLabel>
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
    { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StorybookLabel },
    `<div class="px-12">
      <div class="mx-auto max-w-sm space-y-2">
        <StorybookLabel>Set each item's basis to show several slides per view</StorybookLabel>
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
  parameters: example(carouselAutoplaySource),
  render: render({ CarouselAutoplay, StorybookLabel }, `
    <div class="px-12">
      <div class="mx-auto max-w-xs space-y-2">
        <StorybookLabel>Autoplay plugin advances every 2s and pauses on hover</StorybookLabel>
        <CarouselAutoplay />
      </div>
    </div>
  `),
};

export const CustomPlugin: Story = {
  parameters: example(
    carouselCustomPluginSource,
    'The `plugins` prop accepts any custom [Embla plugin](https://www.embla-carousel.com/api/plugins/). This one hooks the Embla `select` event to report the active slide.',
  ),
  render: render({ CarouselCustomPlugin }, `
    <div class="px-12">
      <div class="mx-auto max-w-xs"><CarouselCustomPlugin /></div>
    </div>
  `),
};

export const Vertical: Story = {
  render: render(
    { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Card, CardContent, StorybookLabel },
    `<div class="py-12">
      <div class="mx-auto max-w-xs space-y-2">
        <StorybookLabel>Vertical orientation scrolls up and down</StorybookLabel>
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
