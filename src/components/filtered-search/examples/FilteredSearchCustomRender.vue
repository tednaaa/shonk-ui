<script setup lang="ts">
import type { ActiveFilter, FilterOption } from 'shonk-ui';
import { defineFilter, FilteredSearch } from 'shonk-ui';
import { h, ref } from 'vue';

interface ColoredOption extends FilterOption {
	color: string;
}

const operators = [
	{ value: 'oneOf', label: 'is one of' },
	{ value: 'noneOf', label: 'is none of' },
];

function dot({ color }: ColoredOption) {
	return h('span', { class: ['size-2 shrink-0 rounded-full', color] });
}

function avatar({ color, label }: ColoredOption) {
	const initials = label.split(' ').map(part => part.charAt(0)).join('');
	return h('span', { class: ['flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white', color] }, initials);
}

function withMarks(marks: ReturnType<typeof h>[], text: string) {
	return h('span', { class: 'inline-flex items-center gap-1.5' }, [h('span', { class: 'flex gap-0.5' }, marks), text]);
}

const labels = defineFilter<ColoredOption>({
	key: 'label',
	label: 'Label',
	multiSelect: true,
	operators,
	options: [
		{ value: 'bug', label: 'bug', color: 'bg-red-500' },
		{ value: 'feature', label: 'feature', color: 'bg-emerald-500' },
		{ value: 'docs', label: 'docs', color: 'bg-sky-500' },
		{ value: 'wip', label: 'WIP', color: 'bg-amber-500' },
	],
	renderOption: option => withMarks([dot(option)], option.label),
	renderValue: ({ filter, options }) => withMarks(options.map(dot), options.length > 2 ? `${options.length} labels` : filter.valueLabel),
});

const assignees = defineFilter<ColoredOption>({
	key: 'assignee',
	label: 'Assignee',
	multiSelect: true,
	operators,
	options: [
		{ value: 'ada', label: 'Ada Lovelace', color: 'bg-violet-500' },
		{ value: 'alan', label: 'Alan Turing', color: 'bg-teal-500' },
		{ value: 'grace', label: 'Grace Hopper', color: 'bg-rose-500' },
	],
	renderOption: option => withMarks([avatar(option)], option.label),
	renderValue: ({ filter, options }) => withMarks(options.map(avatar), options.length > 1 ? `${options.length} people` : filter.valueLabel),
});

interface TokenOption extends FilterOption {
	hue: number;
}

function coin({ hue, label }: TokenOption) {
	return h('span', { class: 'size-4 shrink-0 rounded-full', style: { backgroundColor: `hsl(${hue} 70% 50%)` }, title: label });
}

const tokens = defineFilter<TokenOption>({
	key: 'token',
	label: 'Token',
	multiSelect: true,
	operators,
	options: Array.from({ length: 1000 }, (_, index) => ({ value: `T${index + 1}`, label: `TOKEN${index + 1}`, hue: (index * 37) % 360 })),
	renderOption: option => withMarks([coin(option)], option.label),
	renderValue: ({ options }) => {
		const listed = options.slice(0, 2);
		const rest = options.length - listed.length;
		return withMarks(listed.map(coin), [listed.map(option => option.label).join(', '), rest > 0 && `+${rest}`].filter(Boolean).join(' '));
	},
});

const definitions = [labels, assignees, tokens];

const filters = ref<ActiveFilter[]>([
	{ id: 'labels', key: 'label', keyLabel: 'Label', operator: 'oneOf', operatorLabel: 'is one of', value: ['bug', 'feature', 'docs'], valueLabel: 'bug, feature, docs' },
	{ id: 'assignees', key: 'assignee', keyLabel: 'Assignee', operator: 'oneOf', operatorLabel: 'is one of', value: ['ada', 'grace'], valueLabel: 'Ada Lovelace, Grace Hopper' },
	{ id: 'tokens', key: 'token', keyLabel: 'Token', operator: 'noneOf', operatorLabel: 'is none of', value: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'], valueLabel: 'TOKEN1, TOKEN2, TOKEN3, TOKEN4, TOKEN5, TOKEN6' },
]);
</script>

<template>
	<FilteredSearch v-model:filters="filters" :definitions="definitions" wrap />
</template>
