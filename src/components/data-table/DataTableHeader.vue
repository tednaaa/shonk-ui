<script setup lang="ts" generic="TData extends object">
import type { KitTable } from './lib/features';
import { TableHeader, TableRow } from '../table';
import DataTableHeadCell from './DataTableHeadCell.vue';

defineProps<{
  table: KitTable<TData>;
}>();
</script>

<template>
  <TableHeader class="sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_var(--border)]">
    <TableRow
      v-for="headerGroup in table.getHeaderGroups()"
      :key="headerGroup.id"
    >
      <DataTableHeadCell
        v-for="header in headerGroup.headers"
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
