<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
  {
    key: 'status',
    label: 'Status',
    unique: true,
    operators: [{ value: 'equals', label: 'is' }],
    options: [
      { value: 'open', label: 'Open' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  {
    key: 'milestone',
    label: 'Milestone',
    unique: true,
    operators: [{ value: 'equals', label: 'is' }],
    options: [
      { value: 'v1', label: 'v1.0' },
      { value: 'v2', label: 'v2.0' },
    ],
  },
  {
    key: 'label',
    label: 'Label',
    operators: [
      { value: 'equals', label: 'is' },
      { value: 'notEquals', label: 'is not' },
    ],
  },
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
  <FilteredSearch v-model:filters="filters" :definitions="definitions" />
</template>
