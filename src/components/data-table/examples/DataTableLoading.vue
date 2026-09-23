<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { DataTable, Label, Switch, useDataTable } from 'shonk-ui';
import { ref } from 'vue';

interface Invoice {
  id: string;
  client: string;
  amount: number;
}

const invoices: Invoice[] = [
  { id: 'INV001', client: 'Acme Corp', amount: 250 },
  { id: 'INV002', client: 'Globex', amount: 150 },
  { id: 'INV003', client: 'Initech', amount: 350 },
];

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount' },
];

const loading = ref(true);
const loaded = ref(false);

const table = useDataTable({ data: () => (loaded.value ? invoices : []), columns });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <div class="flex gap-6">
      <Label class="gap-3">
        <Switch v-model="loading" />
        Loading
      </Label>
      <Label class="gap-3">
        <Switch v-model="loaded" />
        Has rows
      </Label>
    </div>

    <DataTable
      :table="table"
      :loading="loading"
    />
  </div>
</template>
