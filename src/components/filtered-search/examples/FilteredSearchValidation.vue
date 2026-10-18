<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

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
	<FilteredSearch v-model:filters="filters" :definitions="definitions" />
</template>
