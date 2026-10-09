import type { Ref } from 'vue';
import type { ChartConfig } from './types';
import { createContext } from 'reka-ui';

export const [useChart, provideChartContext] = createContext<{
	config: Ref<ChartConfig>;
}>('ChartContainer');
