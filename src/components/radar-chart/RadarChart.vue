<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { RadarChartItem } from './types';
import { computed, nextTick, useTemplateRef } from 'vue';
import { cn } from '@/utils';
import { axisAngle, labelStyle, polar, toPoints } from './geometry';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
	items: RadarChartItem[];
	max?: number;
	rings?: number;
	class?: HTMLAttributes['class'];
}>(), {
	max: 100,
	rings: 4,
});

const active = defineModel<string>('active');

const center = 200;
const radius = 150;
const keySteps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const group = useTemplateRef('group');

const axes = computed(() => props.items.map((item, index) => {
	const angle = axisAngle(index, props.items.length);
	const share = Math.min(Math.max(item.value ?? 0, 0), props.max) / props.max;

	return {
		item,
		end: polar(center, radius, angle),
		point: polar(center, radius * share, angle),
		label: labelStyle(center, radius + 14, angle),
	};
}));

const ringPolygons = computed(() => Array.from({ length: props.rings }, (_, ring) =>
	toPoints(props.items.map((_, index) => polar(center, radius * (ring + 1) / props.rings, axisAngle(index, props.items.length))))));

const area = computed(() => toPoints(axes.value.map(axis => axis.point)));

const activeIndex = computed(() => props.items.findIndex(item => item.key === active.value));
const focusIndex = computed(() => Math.max(activeIndex.value, 0));

function accessibleName(item: RadarChartItem) {
	return item.value === null ? item.label : `${item.label}: ${item.value}`;
}

async function onKeydown(event: KeyboardEvent) {
	const count = props.items.length;
	let next: number;

	if (event.key === 'Home')
		next = 0;
	else if (event.key === 'End')
		next = count - 1;
	else if (event.key in keySteps)
		next = (focusIndex.value + keySteps[event.key] + count) % count;
	else
		return;

	event.preventDefault();
	active.value = props.items[next].key;
	await nextTick();
	group.value?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
}
</script>

<template>
	<div data-slot="radar-chart" :class="cn('w-full px-10', props.class)">
		<div
			ref="group"
			v-bind="$attrs"
			role="radiogroup"
			class="relative aspect-square w-full"
			@keydown="onKeydown"
		>
			<svg viewBox="0 0 400 400" class="absolute inset-0 size-full overflow-visible" aria-hidden="true">
				<polygon
					v-for="ring in ringPolygons"
					:key="ring"
					:points="ring"
					class="fill-none stroke-border"
				/>
				<line
					v-for="(axis, index) in axes"
					:key="axis.item.key"
					:x1="center"
					:y1="center"
					:x2="axis.end.x"
					:y2="axis.end.y"
					:class="index === activeIndex ? 'stroke-foreground/40' : 'stroke-border'"
				/>
				<polygon :points="area" class="fill-primary/15 stroke-primary stroke-2" stroke-linejoin="round" />
				<template v-for="(axis, index) in axes" :key="axis.item.key">
					<circle
						v-if="axis.item.value !== null"
						:cx="axis.point.x"
						:cy="axis.point.y"
						:r="index === activeIndex ? 6 : 4"
						class="fill-(--radar-point) stroke-background stroke-2 transition-[r] motion-reduce:transition-none"
						:style="{ '--radar-point': axis.item.color ?? 'var(--color-primary)' }"
					/>
				</template>
			</svg>
			<button
				v-for="(axis, index) in axes"
				:key="axis.item.key"
				type="button"
				role="radio"
				:aria-checked="index === activeIndex"
				:aria-label="accessibleName(axis.item)"
				:tabindex="index === focusIndex ? 0 : -1"
				:style="axis.label"
				class="absolute max-w-24 rounded-sm px-1 py-0.5 text-xs text-balance text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-checked:font-medium aria-checked:text-foreground"
				@click="active = axis.item.key"
			>
				{{ axis.item.label }}
			</button>
		</div>
	</div>
</template>
