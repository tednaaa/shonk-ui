import type { DataTableColumn, DataTableColumnVisibilityState, DataTablePaginationState, DataTableRowPinningState } from '../types';
import { ref } from 'vue';
import { expandColumn } from '../columns/expandColumn';
import { selectColumn } from '../columns/selectColumn';
import { useDataTable } from '../useDataTable';
import { exportRows } from './exportRows';

interface Deal {
  id: string;
  client: string;
  amount: number;
  closed: boolean;
  manager: string | null;
}

const deals: Deal[] = [
  { id: '1', client: 'Alpha', amount: 1200, closed: true, manager: 'Ada' },
  { id: '2', client: 'Beta', amount: 900, closed: false, manager: null },
];

interface TableState {
  columnVisibility?: DataTableColumnVisibilityState;
  pagination?: DataTablePaginationState;
  rowPinning?: DataTableRowPinningState;
}

function exportDeals(columns: DataTableColumn<Deal>[], state: TableState = {}) {
  const table = useDataTable({
    data: deals,
    columns,
    getRowId: deal => deal.id,
    columnVisibility: state.columnVisibility && ref(state.columnVisibility),
    pagination: state.pagination && ref(state.pagination),
    rowPinning: state.rowPinning && ref(state.rowPinning),
  });

  return exportRows(table);
}

describe('exportRows', () => {
  it('should export the visible columns in table order with their headers', () => {
    expect(exportDeals([{ accessorKey: 'client', header: 'Client' }, { accessorKey: 'amount', header: 'Amount' }])).toEqual({
      header: ['Client', 'Amount'],
      rows: [['Alpha', 1200], ['Beta', 900]],
    });
  });

  it('should name a column by its label, and by its id when it has neither label nor header', () => {
    const data = exportDeals([
      { accessorKey: 'client', header: 'Client', label: 'Client name' },
      { accessorKey: 'amount' },
    ]);

    expect(data.header).toEqual(['Client name', 'amount']);
  });

  it('should skip a hidden column', () => {
    const data = exportDeals(
      [{ accessorKey: 'client', header: 'Client' }, { accessorKey: 'amount', header: 'Amount' }],
      { columnVisibility: { amount: false } },
    );

    expect(data).toEqual({ header: ['Client'], rows: [['Alpha'], ['Beta']] });
  });

  it('should skip columns without a value of their own', () => {
    const data = exportDeals([
      selectColumn(),
      expandColumn(),
      { id: 'actions', header: 'Actions' },
      { accessorKey: 'client', header: 'Client' },
    ]);

    expect(data).toEqual({ header: ['Client'], rows: [['Alpha'], ['Beta']] });
  });

  it('should name a column of a group after the group and itself', () => {
    const data = exportDeals([
      {
        id: 'deal',
        header: 'Deal',
        columns: [
          { accessorKey: 'client', header: 'Client' },
          { accessorKey: 'amount', header: 'Amount', exportValue: ({ value }) => `${value} USD` },
        ],
      },
    ]);

    expect(data).toEqual({
      header: ['Deal / Client', 'Deal / Amount'],
      rows: [['Alpha', '1200 USD'], ['Beta', '900 USD']],
    });
  });

  it('should name a column of a nested group after every group above it', () => {
    const data = exportDeals([
      {
        id: 'deal',
        header: 'Deal',
        columns: [
          { id: 'money', header: 'Money', columns: [{ accessorKey: 'amount', header: 'Amount' }] },
          { id: 'people', columns: [{ accessorKey: 'manager', header: 'Manager' }] },
        ],
      },
    ]);

    expect(data.header).toEqual(['Deal / Money / Amount', 'Deal / Manager']);
  });

  it('should export a pinned column first, as the table draws it', () => {
    const data = exportDeals([
      { accessorKey: 'client', header: 'Client' },
      { accessorKey: 'amount', header: 'Amount', pinned: true },
    ]);

    expect(data).toEqual({ header: ['Amount', 'Client'], rows: [[1200, 'Alpha'], [900, 'Beta']] });
  });

  it('should keep text and numbers as they are and turn anything else into text', () => {
    const data = exportDeals([{ accessorKey: 'closed', header: 'Closed' }, { accessorKey: 'manager', header: 'Manager' }]);

    expect(data.rows).toEqual([['true', 'Ada'], ['false', null]]);
  });

  it('should let a column write its own value from the row and the value', () => {
    const data = exportDeals([
      { accessorKey: 'closed', header: 'Closed', exportValue: ({ row, value }) => value ? `${row.client}: yes` : 'no' },
    ]);

    expect(data.rows).toEqual([['Alpha: yes'], ['no']]);
  });

  it('should export a column with a function accessor by its computed value', () => {
    const data = exportDeals([
      { id: 'manager', header: 'Manager', accessorFn: deal => deal.manager ?? 'Unassigned' },
      { id: 'vat', header: 'VAT', accessorFn: deal => deal.amount, exportValue: ({ value }) => Number(value) / 5 },
    ]);

    expect(data.rows).toEqual([['Ada', 240], ['Unassigned', 180]]);
  });

  it('should export a column without an accessor when it writes its own value', () => {
    const data = exportDeals([{ id: 'summary', header: 'Deal', exportValue: ({ row }) => `${row.client}: ${row.amount}` }]);

    expect(data).toEqual({ header: ['Deal'], rows: [['Alpha: 1200'], ['Beta: 900']] });
  });

  it('should export the rows of the current page, pinned rows first', () => {
    const data = exportDeals(
      [{ accessorKey: 'client', header: 'Client' }],
      { pagination: { pageIndex: 0, pageSize: 1 }, rowPinning: { top: ['2'], bottom: [] } },
    );

    expect(data.rows).toEqual([['Beta'], ['Alpha']]);
  });
});
