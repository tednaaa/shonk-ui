<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { CircleDotIcon, UserIcon } from '@lucide/vue';
import { FilteredSearch } from 'shonk-ui';

const definitions: FilterDefinition[] = [
  { key: 'status', label: 'Status', icon: CircleDotIcon, operators: [{ value: 'equals', label: 'is' }] },
  { key: 'assignee', label: 'Assignee', icon: UserIcon, operators: [{ value: 'equals', label: 'is' }] },
];

const filters: ActiveFilter[] = [
  { id: '1', key: 'status', keyLabel: 'Status', operator: 'equals', operatorLabel: 'is', value: 'open', valueLabel: 'Open' },
  { id: '2', key: 'assignee', keyLabel: 'Assignee', operator: 'equals', operatorLabel: 'is', value: 'ada', valueLabel: 'Ada Lovelace' },
];
</script>

<template>
  <FilteredSearch view-only :definitions="definitions" :filters="filters" search-text="race condition" />
</template>
