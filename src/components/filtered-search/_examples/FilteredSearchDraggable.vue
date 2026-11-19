<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { Button, FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
	{ key: 'title', label: 'Title', operators: [{ value: 'contains', label: 'contains' }] },
	{ key: 'assignee', label: 'Assignee', operators: [{ value: 'equals', label: 'is' }] },
	{ key: 'label', label: 'Label', operators: [{ value: 'equals', label: 'is' }] },
];

const filters = ref<ActiveFilter[]>([
	{ id: '1', key: 'title', keyLabel: 'Title', operator: 'contains', operatorLabel: 'contains', value: 'race', valueLabel: 'race' },
	{ id: '2', key: 'assignee', keyLabel: 'Assignee', operator: 'equals', operatorLabel: 'is', value: 'ada', valueLabel: 'Ada Lovelace' },
	{ id: '3', key: 'label', keyLabel: 'Label', operator: 'equals', operatorLabel: 'is', value: 'bug', valueLabel: 'bug' },
]);
const dragging = ref(true);
</script>

<template>
	<div class="flex flex-col gap-2">
		<FilteredSearch v-model:filters="filters" :definitions="definitions" :draggable="dragging" />
		<Button
			variant="secondary"
			size="sm"
			class="self-start"
			:aria-pressed="dragging"
			@click="dragging = !dragging"
		>
			{{ dragging ? 'Turn off dragging' : 'Turn on dragging' }}
		</Button>
	</div>
</template>
