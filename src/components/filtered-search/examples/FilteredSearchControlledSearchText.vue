<script setup lang="ts">
import type { FilterDefinition } from 'shonk-ui';
import { FilteredSearch, Input } from 'shonk-ui';
import { ref } from 'vue';
import { StorybookLabel } from '@/lib/storybook';

const definitions: FilterDefinition[] = [
	{ key: 'title', label: 'Title', operators: [{ value: 'contains', label: 'contains' }] },
];

const searchText = ref('');
</script>

<template>
	<div class="flex flex-col gap-4">
		<StorybookLabel>The app owns searchText: edit it here or in the bar</StorybookLabel>
		<Input v-model="searchText" placeholder="searchText" />
		<FilteredSearch v-model:search-text="searchText" :definitions="definitions" />
	</div>
</template>
