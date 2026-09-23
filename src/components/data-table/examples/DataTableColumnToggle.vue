<script setup lang="ts">
import type { DataTableColumn, DataTableColumnVisibilityState } from 'shonk-ui';
import { DataTable, DataTableColumnToggle, useDataTable } from 'shonk-ui';
import { computed, ref } from 'vue';

interface Status {
  id: string;
  name: string;
}

interface StreamStats {
  id: string;
  stream: string;
  leads: number;
  calls: number;
  conversion: number;
  statusCounts: Record<string, number>;
}

const statuses: Status[] = [
  { id: 'new', name: 'New' },
  { id: 'in-progress', name: 'In progress' },
  { id: 'callback', name: 'Callback' },
  { id: 'meeting', name: 'Meeting set' },
  { id: 'contract', name: 'Contract sent' },
  { id: 'deal', name: 'Deal' },
  { id: 'rejected', name: 'Rejected' },
  { id: 'no-answer', name: 'No answer' },
];

const streamNames = ['Real estate — Moscow', 'Dentistry — Kazan', 'Car service — Samara', 'Legal — Tver', 'Windows — Tula'];

const rows: StreamStats[] = streamNames.map((stream, index) => ({
  id: String(index + 1),
  stream,
  leads: 120 + index * 37,
  calls: 300 + index * 81,
  conversion: 18 + index * 3,
  statusCounts: Object.fromEntries(statuses.map((status, statusIndex) => [status.id, (index * 7 + statusIndex * 5) % 40])),
}));

const columns: DataTableColumn<StreamStats>[] = [
  { accessorKey: 'stream', header: 'Stream', hideable: false, class: 'font-medium whitespace-nowrap' },
  { accessorKey: 'leads', header: 'Leads', class: 'text-right tabular-nums', headerClass: 'text-right' },
  { accessorKey: 'calls', header: 'Calls', class: 'text-right tabular-nums', headerClass: 'text-right' },
  {
    accessorKey: 'conversion',
    header: 'Conv.',
    label: 'Conversion to lead',
    class: 'text-right tabular-nums',
    headerClass: 'text-right',
    cell: ({ value }) => `${value}%`,
  },
  ...statuses.map((status): DataTableColumn<StreamStats> => ({
    id: status.id,
    header: status.name,
    accessorFn: row => row.statusCounts[status.id],
    class: 'text-right tabular-nums',
    headerClass: 'text-right whitespace-nowrap',
  })),
];

const columnVisibility = ref<DataTableColumnVisibilityState>({ 'callback': false, 'no-answer': false });

const hiddenColumnIds = computed(() => Object.keys(columnVisibility.value).filter(id => columnVisibility.value[id] === false));

const table = useDataTable({ data: rows, columns, getRowId: row => row.id, columnVisibility });
</script>

<template>
  <div class="flex max-w-5xl flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hidden in the visibility ref: {{ hiddenColumnIds.join(', ') || 'none' }}. Columns hide as soon as they are clicked, the stream column stays, the last visible column cannot be hidden.
      </p>
      <DataTableColumnToggle :table="table" />
    </div>

    <DataTable :table="table" />
  </div>
</template>
