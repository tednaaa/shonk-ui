<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { Button, DataTable, useDataTable } from 'shonk-ui';

interface Invoice {
  id: string;
  client: string;
  amount: number;
}

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount' },
];

const filteredTable = useDataTable<Invoice>({ data: [], columns });
const blankTable = useDataTable<Invoice>({ data: [], columns });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <DataTable
      :table="filteredTable"
      empty-text="No invoices match the filters"
    />

    <DataTable :table="blankTable">
      <template #empty>
        <div class="flex flex-col items-center gap-3">
          No invoices yet
          <Button size="sm">Create invoice</Button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
