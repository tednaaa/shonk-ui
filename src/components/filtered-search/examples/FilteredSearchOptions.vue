<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { CircleDotIcon, UserIcon } from '@lucide/vue';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
  {
    key: 'status',
    label: 'Status',
    icon: CircleDotIcon,
    operators: [
      { value: 'equals', label: 'is' },
      { value: 'notEquals', label: 'is not' },
    ],
    options: [
      { value: 'open', label: 'Open' },
      { value: 'merged', label: 'Merged' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  {
    key: 'assignee',
    label: 'Assignee',
    icon: UserIcon,
    operators: [{ value: 'equals', label: 'is' }],
    options: [
      { value: 'ada', label: 'Ada Lovelace' },
      { value: 'alan', label: 'Alan Turing' },
      { value: 'grace', label: 'Grace Hopper' },
    ],
  },
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
  <FilteredSearch v-model:filters="filters" :definitions="definitions" />
</template>
