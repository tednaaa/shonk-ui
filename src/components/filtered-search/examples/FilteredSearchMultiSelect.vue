<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { TagIcon } from '@lucide/vue';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
  {
    key: 'label',
    label: 'Label',
    icon: TagIcon,
    multiSelect: true,
    operators: [
      { value: 'oneOf', label: 'is one of' },
      { value: 'noneOf', label: 'is none of' },
    ],
    options: [
      { value: 'bug', label: 'bug' },
      { value: 'feature', label: 'feature' },
      { value: 'docs', label: 'docs' },
      { value: 'wip', label: 'WIP' },
    ],
  },
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
  <FilteredSearch v-model:filters="filters" :definitions="definitions" />
</template>
