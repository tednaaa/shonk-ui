<script setup lang="ts">
import type { ActiveFilter, FilterDefinition } from 'shonk-ui';
import { BookmarkIcon } from '@lucide/vue';
import { Button, FilteredSearch } from 'shonk-ui';
import { ref } from 'vue';

const definitions: FilterDefinition[] = [
  { key: 'title', label: 'Title', operators: [{ value: 'contains', label: 'contains' }] },
  { key: 'assignee', label: 'Assignee', operators: [{ value: 'equals', label: 'is' }] },
];

const filters = ref<ActiveFilter[]>([]);
</script>

<template>
  <FilteredSearch v-model:filters="filters" :definitions="definitions">
    <template #suffix>
      <Button variant="ghost" size="icon-sm" aria-label="Save this search">
        <BookmarkIcon class="size-4" />
      </Button>
    </template>
  </FilteredSearch>
</template>
