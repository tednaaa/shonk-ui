<script setup lang="ts">
import type { DataTableColumn, DataTablePaginationState } from 'shonk-ui';
import { DataTablePagination, DataTablePaginationPages, useDataTable } from 'shonk-ui';
import { ref } from 'vue';

interface Order {
  id: string;
}

const orders: Order[] = Array.from({ length: 200 }, (_, index) => ({ id: String(index + 1) }));

const columns: DataTableColumn<Order>[] = [{ accessorKey: 'id', header: 'Order' }];

const pagination = ref<DataTablePaginationState>({ pageIndex: 9, pageSize: 10 });

const table = useDataTable({ data: orders, columns, pagination });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-8">
    <div class="flex flex-col gap-3">
      <code class="text-sm text-muted-foreground">variant="default"</code>
      <DataTablePagination :table="table">
        <DataTablePaginationPages />
      </DataTablePagination>
    </div>

    <div class="flex flex-col gap-3">
      <code class="text-sm text-muted-foreground">variant="compact"</code>
      <DataTablePagination :table="table">
        <DataTablePaginationPages variant="compact" />
      </DataTablePagination>
    </div>
  </div>
</template>
