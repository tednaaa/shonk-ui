<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { BookmarkIcon, ClockIcon, SlidersHorizontalIcon } from '@lucide/vue';
import { Button, ButtonGroup, FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
	{
		key: 'status',
		label: 'Status',
		operators: [{ value: 'equals', label: 'is' }],
		options: [
			{ value: 'open', label: 'Open' },
			{ value: 'closed', label: 'Closed' },
		],
	},
	{ key: 'title', label: 'Title', operators: [{ value: 'contains', label: 'contains' }] },
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
	<ButtonGroup class="w-full">
		<Button variant="secondary" size="icon" aria-label="Saved searches">
			<ClockIcon class="size-4" />
		</Button>
		<Button variant="secondary" size="icon" aria-label="Save this search">
			<BookmarkIcon class="size-4" />
		</Button>
		<FilteredSearch v-model:filters="filters" :definitions="definitions" class="min-w-0 flex-1" />
		<Button variant="secondary" size="icon" aria-label="Display options">
			<SlidersHorizontalIcon class="size-4" />
		</Button>
	</ButtonGroup>
</template>
