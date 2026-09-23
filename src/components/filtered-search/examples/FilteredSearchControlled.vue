<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <FilteredSearch
      v-model:filters="filters"
      v-model:search-text="searchText"
      :definitions="definitions"
    />
    <pre class="text-xs text-muted-foreground">{{ JSON.stringify({ searchText, filters }, null, 2) }}</pre>
  </div>
</template>
