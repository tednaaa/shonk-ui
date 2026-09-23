<script setup lang="ts">
import type { ActiveFilter } from 'shonk-ui';
import { CalendarIcon } from '@lucide/vue';
import { FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';
import FilteredSearchDateEditor from './FilteredSearchDateEditor.vue';

const definitions = [
  {
    key: 'createdAt',
    label: 'Created',
    icon: CalendarIcon,
    editor: FilteredSearchDateEditor,
    operators: [
      { value: 'greaterOrEqual', label: 'on or after' },
      { value: 'lessOrEqual', label: 'on or before' },
    ],
  },
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
  <FilteredSearch v-model:filters="filters" :definitions="definitions" />
</template>
