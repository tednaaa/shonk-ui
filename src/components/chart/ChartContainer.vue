<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { ChartConfig } from './types';
import { computed, toRef } from 'vue';
import { cn } from '@/utils';
import { provideChartContext } from './context';

const props = defineProps<{
	config: ChartConfig;
	cursor?: boolean;
	class?: HTMLAttributes['class'];
}>();

provideChartContext({ config: toRef(props, 'config') });

const theme = {
	'--vis-font-family': 'var(--font-sans)',
	'--vis-axis-tick-label-color': 'var(--color-muted-foreground)',
	'--vis-axis-label-color': 'var(--color-muted-foreground)',
	'--vis-axis-tick-color': 'var(--color-border)',
	'--vis-axis-domain-color': 'var(--color-border)',
	'--vis-axis-grid-color': 'var(--color-border)',
	'--vis-crosshair-line-stroke-color': 'var(--color-muted-foreground)',
	'--vis-crosshair-circle-stroke-color': 'var(--color-background)',
	'--vis-tooltip-padding': '0px',
	'--vis-tooltip-background-color': 'transparent',
	'--vis-tooltip-border-color': 'transparent',
	'--vis-tooltip-shadow-color': 'transparent',
	'--vis-tooltip-backdrop-filter': 'none',
};

const seriesColors = computed(() => {
	const colors: Record<`--chart-${string}`, string> = {};

	for (const [key, { color }] of Object.entries(props.config)) {
		if (color !== undefined)
			colors[`--chart-${key}`] = color;
	}

	return colors;
});
</script>

<template>
	<div
		data-slot="chart"
		:class="cn('flex aspect-video w-full flex-col text-xs **:data-vis-xy-container:min-h-0 **:data-vis-xy-container:w-full **:data-vis-xy-container:flex-1', props.class)"
		:style="[theme, seriesColors, { '--vis-crosshair-line-stroke-width': cursor ? '1px' : '0px' }]"
	>
		<slot />
	</div>
</template>
