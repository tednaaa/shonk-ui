<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { DownloadIcon, EllipsisIcon } from '@lucide/vue';
import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Switch,
  useDataTable,
} from 'shonk-ui';
import { ref } from 'vue';

interface Invoice {
  id: string;
  client: string;
  website: string;
  reminders: boolean;
}

const invoices = ref<Invoice[]>([
  { id: 'INV001', client: 'Acme Corp', website: 'acme.example.com', reminders: true },
  { id: 'INV002', client: 'Globex', website: 'globex.example.com', reminders: false },
  { id: 'INV003', client: 'Initech', website: 'initech.example.com', reminders: true },
]);

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice', class: 'font-medium' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'website', header: 'Website' },
  { accessorKey: 'reminders', header: 'Reminders' },
  { id: 'actions', class: 'w-0' },
];

const table = useDataTable({ data: invoices, columns, getRowId: invoice => invoice.id });

const lastAction = ref('Click a row or a control inside it');

function openInvoice(invoice: Invoice) {
  lastAction.value = `Opened ${invoice.id}`;
}

function toggleReminders(invoice: Invoice, reminders: boolean) {
  invoice.reminders = reminders;
  lastAction.value = `Reminders for ${invoice.id} ${reminders ? 'on' : 'off'}`;
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <DataTable
      :table="table"
      @row-click="openInvoice"
    >
      <template #cell-website="{ row }">
        <a
          class="text-primary underline-offset-4 hover:underline"
          :href="`https://${row.website}`"
          target="_blank"
        >
          {{ row.website }}
        </a>
      </template>

      <template #cell-reminders="{ row }">
        <Switch
          :model-value="row.reminders"
          @update:model-value="toggleReminders(row, $event)"
        />
      </template>

      <template #cell-actions="{ row }">
        <div class="flex gap-1">
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Download"
            @click="lastAction = `Downloaded ${row.id}`"
          >
            <DownloadIcon />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="More actions"
              >
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @select="lastAction = `Duplicated ${row.id}`">Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </template>
    </DataTable>

    <p class="text-sm text-muted-foreground">{{ lastAction }}</p>
  </div>
</template>
