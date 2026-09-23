<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { Badge, DataTable, useDataTable } from 'shonk-ui';

interface Invoice {
  id: string;
  client: string;
  issued: Date;
  paid: boolean;
  amount: number;
}

const invoices: Invoice[] = [
  { id: 'INV-12', client: 'Umbrella', issued: new Date(2026, 2, 14), paid: true, amount: 450 },
  { id: 'INV-3', client: 'Globex', issued: new Date(2026, 0, 3), paid: false, amount: 150 },
  { id: 'INV-7', client: 'Initech', issued: new Date(2026, 1, 21), paid: false, amount: 350 },
  { id: 'INV-1', client: 'Acme Corp', issued: new Date(2025, 11, 30), paid: true, amount: 250 },
  { id: 'INV-10', client: 'Hooli', issued: new Date(2026, 1, 2), paid: true, amount: 150 },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice', class: 'font-medium', sortable: true },
  { accessorKey: 'client', header: 'Client', sortable: true },
  { accessorKey: 'issued', header: 'Issued', sortable: true, cell: ({ value }) => date.format(value) },
  { accessorKey: 'paid', header: 'Status' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    class: 'text-right',
    headerClass: 'text-right',
    sortable: true,
    cell: ({ value }) => currency.format(value),
  },
];

const table = useDataTable({ data: invoices, columns });
</script>

<template>
  <div class="max-w-3xl">
    <DataTable :table="table">
      <template #cell-paid="{ row }">
        <Badge :variant="row.paid ? 'default' : 'secondary'">
          {{ row.paid ? 'Paid' : 'Pending' }}
        </Badge>
      </template>
    </DataTable>
  </div>
</template>
