<script setup lang="ts">
import type { ChartConfig } from 'shonk-ui/charts';
import {
	ChartContainer,
	ChartCrosshair,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	componentToString,
	VisAxis,
	VisGroupedBar,
	VisXYContainer,
} from 'shonk-ui/charts';

interface Month {
	date: Date;
	inbound: number;
	outbound: number;
}

const data: Month[] = [
	{ date: new Date(2026, 0, 1), inbound: 1860, outbound: 800 },
	{ date: new Date(2026, 1, 1), inbound: 3050, outbound: 2000 },
	{ date: new Date(2026, 2, 1), inbound: 2370, outbound: 1200 },
	{ date: new Date(2026, 3, 1), inbound: 730, outbound: 1900 },
	{ date: new Date(2026, 4, 1), inbound: 2090, outbound: 1300 },
	{ date: new Date(2026, 5, 1), inbound: 2140, outbound: 1400 },
];

const config = {
	inbound: { label: 'Inbound', color: 'var(--color-chart-1)' },
	outbound: { label: 'Outbound', color: 'var(--color-chart-2)' },
} satisfies ChartConfig;

function x(month: Month) {
	return month.date;
}

const y = [(month: Month) => month.inbound, (month: Month) => month.outbound];
const colors = [config.inbound.color, config.outbound.color];

function shortMonth(date: number | Date) {
	return new Date(date).toLocaleDateString('en-US', { month: 'short' });
}

const tooltip = componentToString(config, ChartTooltipContent, {
	labelFormatter: date => new Date(date).toLocaleDateString('en-US', { month: 'long' }),
});
</script>

<template>
	<ChartContainer :config="config" class="aspect-auto h-72">
		<VisXYContainer :data="data">
			<VisGroupedBar :x="x" :y="y" :color="colors" :rounded-corners="4" :group-padding="0.2" />
			<VisAxis
				type="x"
				:x="x"
				:tick-format="shortMonth"
				:tick-values="data.map(x)"
				:tick-line="false"
				:domain-line="false"
				:grid-line="false"
			/>
			<VisAxis type="y" :num-ticks="4" :tick-line="false" :domain-line="false" />
			<ChartTooltip />
			<ChartCrosshair :template="tooltip" :color="colors" />
		</VisXYContainer>

		<ChartLegendContent />
	</ChartContainer>
</template>
