import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render } from '@/lib/storybook';
import { RadarChart } from '.';
import RadarChartDefault from './examples/RadarChartDefault.vue';
import radarChartDefaultSource from './examples/RadarChartDefault.vue?raw';

const meta: Meta<typeof RadarChart> = {
	title: 'Data/RadarChart',
	component: RadarChart,
	tags: ['autodocs'],
	parameters: example(radarChartDefaultSource, 'Point colors come from the values: the example maps each value to a status token.'),
	render: render({ RadarChartDefault }, `<RadarChartDefault />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
