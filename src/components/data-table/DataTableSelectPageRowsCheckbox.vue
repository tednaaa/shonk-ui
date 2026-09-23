<script setup lang="ts" generic="TData extends object">
import type { Table } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { Checkbox } from '../checkbox';

const props = defineProps<{
  table: Table<KitFeatures, TData>;
}>();

const locale = useLocale();

const checked = computed(() => {
  if (props.table.getIsAllPageRowsSelected())
    return true;

  return props.table.getIsSomePageRowsSelected() ? 'indeterminate' : false;
});

const hasSelectableRows = computed(() => props.table.getRowModel().rows.some(row => row.getCanSelect()));

function togglePageRows(value: boolean | 'indeterminate') {
  props.table.toggleAllPageRowsSelected(value === true);
}
</script>

<template>
  <Checkbox
    :model-value="checked"
    :disabled="!hasSelectableRows"
    :aria-label="locale.dataTable.selectPageRowsLabel"
    @update:model-value="togglePageRows"
  />
</template>
