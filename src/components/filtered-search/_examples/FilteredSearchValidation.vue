<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';
import { StorybookLabel } from '@/lib/storybook';

const NUMBER = /^-?\d+(?:\.\d+)?$/;

const definitions: FilterDefinition[] = [
	{
		key: 'price',
		label: 'Price',
		operators: [
			{ value: 'gt', label: '> greater than' },
			{ value: 'lt', label: '< less than' },
		],
		validate: value => NUMBER.test(value) ? undefined : 'Enter a number',
	},
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
	<div class="flex flex-col gap-4">
		<StorybookLabel>Pick Price and an operator, then type text instead of a number and press Enter</StorybookLabel>
		<FilteredSearch v-model:filters="filters" :definitions="definitions" />
	</div>
</template>
