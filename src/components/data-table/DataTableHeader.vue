<script setup lang="ts" generic="TData extends object">
import type { HeaderGroup } from '@tanstack/vue-table';
import type { KitFeatures, KitTable } from './lib/features';
import { TableHeader, TableRow } from '../table';
import DataTableHeadCell from './DataTableHeadCell.vue';

defineProps<{
  table: KitTable<TData>;
}>();

function uncoveredHeaders(headerGroup: HeaderGroup<KitFeatures, TData>) {
  return headerGroup.headers.filter(header => header.rowSpan > 0);
}
</script>

<template>
  <TableHeader class="sticky top-0 z-10 bg-background [&_tr]:border-b-0">
    <TableRow
      v-for="headerGroup in table.getHeaderGroups()"
      :key="headerGroup.id"
    >
      <DataTableHeadCell
        v-for="header in uncoveredHeaders(headerGroup)"
        :key="header.id"
        :header="header"
      >
        <template
          v-for="(_, name) in $slots"
          #[name]="context"
        >
          <slot
            :name="name"
            v-bind="context"
          />
        </template>
      </DataTableHeadCell>
    </TableRow>
  </TableHeader>
</template>
