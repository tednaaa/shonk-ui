<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { Badge, DataTable, useDataTable } from 'shonk-ui';

interface Invoice {
  id: string;
  client: string;
  paid: boolean;
  method: string;
  amount: number;
}

const invoices: Invoice[] = [
  { id: 'INV001', client: 'Acme Corp', paid: true, method: 'Credit Card', amount: 250 },
  { id: 'INV002', client: 'Globex', paid: false, method: 'PayPal', amount: 150 },
  { id: 'INV003', client: 'Initech', paid: false, method: 'Bank Transfer', amount: 350 },
  { id: 'INV004', client: 'Umbrella', paid: true, method: 'Credit Card', amount: 450 },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice', class: 'font-medium' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'paid', header: 'Status' },
  { accessorKey: 'method', header: 'Method' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    class: 'text-right',
    headerClass: 'text-right',
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
