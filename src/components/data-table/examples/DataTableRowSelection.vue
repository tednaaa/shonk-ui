<script setup lang="ts">
import type { DataTableColumn, DataTablePaginationState } from 'shonk-ui';
import { Badge, Button, DataTable, DataTablePagination, DataTablePaginationPages, selectColumn, useDataTable } from 'shonk-ui';
import { computed, h, ref } from 'vue';

interface Lead {
  id: string;
  phone: string;
  site: string;
  archived: boolean;
}

const sites = ['acme.com', 'globex.com', 'initech.com', 'hooli.com', 'umbrella.com'];

const leads: Lead[] = Array.from({ length: 48 }, (_, index) => ({
  id: String(index + 1),
  phone: `+1 555 ${String(index).padStart(4, '0')}`,
  site: sites[index % sites.length] ?? '',
  archived: index % 4 === 3,
}));

const columns: DataTableColumn<Lead>[] = [
  selectColumn(),
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'site', header: 'Site' },
  {
    accessorKey: 'archived',
    header: 'Status',
    cell: ({ value }) => h(Badge, { variant: value ? 'secondary' : 'default' }, () => (value ? 'Archived' : 'Active')),
  },
];

const pagination = ref<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 });
const selectedLeads = ref<Lead[]>([]);

const selectedPhones = computed(() => selectedLeads.value.map(lead => lead.phone));

const table = useDataTable({
  data: leads,
  columns,
  getRowId: lead => lead.id,
  pagination,
  selectedRows: selectedLeads,
  enableRowSelection: lead => !lead.archived,
});

function clearSelection() {
  selectedLeads.value = [];
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <div class="flex min-h-8 items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Selected across pages: {{ selectedPhones.length }}. The header checkbox selects the current page, Shift+click selects a range, archived leads cannot be selected.
      </p>
      <Button
        variant="secondary"
        size="sm"
        :disabled="selectedPhones.length === 0"
        @click="clearSelection"
      >
        Clear selection
      </Button>
    </div>

    <DataTable :table="table" />

    <DataTablePagination :table="table">
      <DataTablePaginationPages />
    </DataTablePagination>

    <p
      v-if="selectedPhones.length > 0"
      class="text-sm text-muted-foreground"
    >
      {{ selectedPhones.join(', ') }}
    </p>
  </div>
</template>
