<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { onUnmounted, watchEffect } from 'vue';
import { useLocale } from '@/locales';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { useDataTablePagination } from './lib/paginationContext';

const props = defineProps<{
  options: number[];
  label?: string;
  class?: HTMLAttributes['class'];
}>();

const locale = useLocale();

const { pageSize, pageSizeOptions, changePageSize } = useDataTablePagination();

watchEffect(() => {
  pageSizeOptions.value = props.options;
});

onUnmounted(() => {
  pageSizeOptions.value = [];
});
</script>

<template>
  <Select
    :model-value="pageSize"
    @update:model-value="changePageSize"
  >
    <SelectTrigger
      size="sm"
      :aria-label="label ?? locale.dataTable.pageSizeLabel"
      :class="props.class"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
