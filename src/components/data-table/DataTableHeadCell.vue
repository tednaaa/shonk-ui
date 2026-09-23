<script setup lang="ts" generic="TData extends object">
import type { Header } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { computed } from 'vue';
import { TableHead } from '../table';

const props = defineProps<{
  header: Header<KitFeatures, TData, unknown>;
}>();

const label = computed(() => {
  const { columnDef } = props.header.column;

  return typeof columnDef.header === 'string' ? columnDef.header : '';
});
</script>

<template>
  <TableHead
    :colspan="header.colSpan"
    :class="header.column.columnDef.meta?.headerClass"
  >
    <slot
      v-if="!header.isPlaceholder"
      :name="`header-${header.column.id}`"
      :label="label"
    >
      {{ label }}
    </slot>
  </TableHead>
</template>
