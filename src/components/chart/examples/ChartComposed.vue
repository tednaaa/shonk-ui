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
  VisLine,
  VisStackedBar,
  VisXYContainer,
} from 'shonk-ui/charts';

interface Day {
  date: Date;
  calls: number;
  answered: number;
}

const data: Day[] = Array.from({ length: 14 }, (_, index) => ({
  date: new Date(2026, 5, index + 1),
  calls: 900 + ((index * 337) % 600),
  answered: 450 + ((index * 211) % 300),
}));

const config = {
  calls: { label: 'Calls', color: 'var(--color-chart-1)' },
  answered: { label: 'Answered', color: 'var(--color-chart-3)' },
} satisfies ChartConfig;

function x(day: Day) {
  return day.date;
}

function shortDate(date: number | Date) {
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

const tooltip = componentToString(config, ChartTooltipContent, {
  labelFormatter: shortDate,
});
</script>

<template>
  <ChartContainer :config="config" class="aspect-auto h-72">
    <VisXYContainer :data="data">
      <VisStackedBar
        :x="x"
        :y="(day: Day) => day.calls"
        :color="config.calls.color"
        :rounded-corners="4"
        :bar-padding="0.3"
      />
      <VisLine
        :x="x"
        :y="(day: Day) => day.answered"
        :color="config.answered.color"
        :line-width="2"
      />
      <VisAxis
        type="x"
        :x="x"
        :tick-format="shortDate"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
      />
      <VisAxis type="y" :num-ticks="4" :tick-line="false" :domain-line="false" />
      <ChartTooltip />
      <ChartCrosshair :template="tooltip" :color="[config.calls.color, config.answered.color]" />
    </VisXYContainer>

    <ChartLegendContent />
  </ChartContainer>
</template>
