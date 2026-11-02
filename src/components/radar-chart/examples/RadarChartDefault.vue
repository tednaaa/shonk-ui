<script setup lang="ts">
import type { RadarChartItem } from 'shonk-ui';
import { Button, RadarChart, Slider } from 'shonk-ui';
import { computed, ref } from 'vue';

interface Skill {
	key: string;
	label: string;
	value: number;
}

const pool = [
	{ key: 'vue', label: 'Vue', value: 85 },
	{ key: 'typescript', label: 'TypeScript', value: 70 },
	{ key: 'testing', label: 'Testing', value: 45 },
	{ key: 'a11y', label: 'Accessibility', value: 30 },
	{ key: 'performance', label: 'Performance', value: 55 },
	{ key: 'css', label: 'CSS', value: 75 },
	{ key: 'node', label: 'Node.js', value: 40 },
	{ key: 'graphql', label: 'GraphQL', value: 20 },
] as const;

const skills = ref<Skill[]>(pool.slice(0, 6).map(skill => ({ ...skill })));
const active = ref('vue');

function colorOf(value: number) {
	if (value >= 70)
		return 'var(--color-success)';

	return value >= 40 ? 'var(--color-warning)' : 'var(--color-destructive)';
}

const items = computed<RadarChartItem[]>(() => skills.value.map(skill => ({ ...skill, color: colorOf(skill.value) })));

function addAxis() {
	const next = pool[skills.value.length];

	if (next)
		skills.value.push({ ...next });
}

function removeAxis() {
	skills.value.pop();

	if (!skills.value.some(skill => skill.key === active.value))
		active.value = skills.value[0].key;
}
</script>

<template>
	<div class="grid max-w-3xl gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
		<RadarChart v-model:active="active" :items="items" aria-label="Frontend skills" />
		<div class="flex flex-col gap-5">
			<div v-for="skill in skills" :key="skill.key" class="flex flex-col gap-2">
				<div class="flex justify-between text-sm">
					<span>{{ skill.label }}</span>
					<span class="text-muted-foreground tabular-nums">{{ skill.value }}</span>
				</div>
				<Slider
					:model-value="[skill.value]"
					:max="100"
					@update:model-value="value => skill.value = value?.[0] ?? 0"
				/>
			</div>
			<div class="flex gap-2">
				<Button variant="secondary" size="sm" :disabled="skills.length >= pool.length" @click="addAxis">
					Add axis
				</Button>
				<Button variant="secondary" size="sm" :disabled="skills.length <= 3" @click="removeAxis">
					Remove axis
				</Button>
			</div>
		</div>
	</div>
</template>
