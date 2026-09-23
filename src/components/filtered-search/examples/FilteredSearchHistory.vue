<script setup lang="ts">
import type { ActiveFilter, FilterDefinition, FilterHistoryItem } from 'shonk-ui';
import { FilteredSearch } from 'shonk-ui';
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
const searchText = ref('');

const historyItems = ref<FilterHistoryItem[]>([
  {
    filters: [{ id: '1', key: 'status', keyLabel: 'Status', operator: 'equals', operatorLabel: 'is', value: 'open', valueLabel: 'Open' }],
    searchText: 'flaky',
  },
  {
    filters: [{ id: '2', key: 'title', keyLabel: 'Title', operator: 'contains', operatorLabel: 'contains', value: 'race', valueLabel: 'race' }],
  },
]);

function clearHistory() {
  historyItems.value = [];
}
</script>

<template>
  <FilteredSearch
    v-model:filters="filters"
    v-model:search-text="searchText"
    :definitions="definitions"
    :history-items="historyItems"
    @clear-history="clearHistory"
  />
</template>
