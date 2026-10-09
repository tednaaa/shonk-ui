import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, StorybookLabel } from '@/lib/storybook';
import { ChartContainer, ChartTooltipContent } from '.';
import ChartArea from './examples/ChartArea.vue';
import chartAreaSource from './examples/ChartArea.vue?raw';
import ChartBarGrouped from './examples/ChartBarGrouped.vue';
import chartBarGroupedSource from './examples/ChartBarGrouped.vue?raw';
import ChartBarStacked from './examples/ChartBarStacked.vue';
import chartBarStackedSource from './examples/ChartBarStacked.vue?raw';
import ChartComposed from './examples/ChartComposed.vue';
import chartComposedSource from './examples/ChartComposed.vue?raw';
import ChartLine from './examples/ChartLine.vue';
import chartLineSource from './examples/ChartLine.vue?raw';

const meta: Meta<typeof ChartContainer> = {
  title: 'Components/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: example(chartAreaSource),
  render: render({ ChartArea }, `<ChartArea />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Area: Story = {};

export const BarGrouped: Story = {
  parameters: example(chartBarGroupedSource),
  render: render({ ChartBarGrouped }, `<ChartBarGrouped />`),
};

export const BarStacked: Story = {
  parameters: example(chartBarStackedSource),
  render: render({ ChartBarStacked }, `<ChartBarStacked />`),
};

export const Line: Story = {
  parameters: example(chartLineSource),
  render: render({ ChartLine }, `<ChartLine />`),
};

export const Composed: Story = {
  parameters: example(chartComposedSource, 'Bars and a line share one Y axis: unovis has a single Y scale per container.'),
  render: render({ ChartComposed }, `<ChartComposed />`),
};

export const TooltipIndicators: Story = {
  render: () => ({
    components: { ChartTooltipContent, StorybookLabel },
    setup: () => ({
      config: {
        inbound: { label: 'Inbound', color: 'var(--color-chart-1)' },
        outbound: { label: 'Outbound', color: 'var(--color-chart-2)' },
      },
      payload: { inbound: 1860, outbound: 800 },
      x: new Date(2026, 0, 1),
    }),
    template: `
      <div class="flex flex-wrap gap-6" style="--chart-inbound: var(--color-chart-1); --chart-outbound: var(--color-chart-2)">
        <div v-for="indicator in ['dot', 'line', 'dashed']" :key="indicator" class="flex flex-col gap-2">
          <StorybookLabel>{{ indicator }}</StorybookLabel>
          <ChartTooltipContent :config="config" :payload="payload" :x="x" :indicator="indicator" />
        </div>
      </div>
    `,
  }),
};
