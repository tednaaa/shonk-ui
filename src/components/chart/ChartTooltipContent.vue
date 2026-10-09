<script setup lang="ts">
import type { ChartTooltipContentProps } from './types';
import { computed } from 'vue';
import { cn } from '@/utils';

const props = withDefaults(defineProps<ChartTooltipContentProps>(), {
	indicator: 'dot',
	labelFormatter: (x: number | Date) => x instanceof Date ? x.toLocaleDateString() : String(x),
	valueFormatter: (value: number) => value.toLocaleString(),
});

const rows = computed(() => {
	const values = new Map<string, unknown>(Object.entries(props.payload));

	return Object.entries(props.config)
		.filter(([key]) => values.get(key) != null)
		.map(([key, item]) => {
			const value = values.get(key);

			return { key, item, value: typeof value === 'number' ? props.valueFormatter(value) : String(value) };
		});
});
</script>

<template>
	<div
		data-slot="chart-tooltip"
		:class="cn('grid min-w-32 items-start gap-1.5 rounded-lg border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-xl', props.class)"
	>
		<div v-if="!hideLabel" class="font-medium">
			{{ labelFormatter(x) }}
		</div>

		<div class="grid gap-1.5">
			<div
				v-for="{ key, item, value } in rows"
				:key="key"
				:class="cn('flex w-full items-stretch gap-2', { 'items-center': indicator === 'dot' })"
			>
				<component :is="item.icon" v-if="item.icon" class="size-2.5 text-muted-foreground" />
				<div
					v-else-if="!hideIndicator"
					:class="cn('shrink-0 rounded-[2px] border-(--indicator-color) bg-(--indicator-color)', {
						'size-2.5': indicator === 'dot',
						'w-1': indicator === 'line',
						'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
					})"
					:style="{ '--indicator-color': `var(--chart-${key})` }"
				/>

				<div class="flex flex-1 items-center justify-between gap-4 leading-none">
					<span class="text-muted-foreground">{{ item.label ?? key }}</span>
					<span class="font-mono font-medium text-popover-foreground tabular-nums">{{ value }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
