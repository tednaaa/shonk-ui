<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { CircleDotIcon, TagIcon, UserIcon } from '@lucide/vue';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
  {
    key: 'title',
    label: 'Title',
    icon: TagIcon,
    operators: [
      { value: 'contains', label: 'contains' },
      { value: 'equals', label: 'exactly equals' },
    ],
  },
  {
    key: 'assignee',
    label: 'Assignee',
    icon: UserIcon,
    operators: [
      { value: 'equals', label: 'is' },
      { value: 'notEquals', label: 'is not' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    icon: CircleDotIcon,
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
