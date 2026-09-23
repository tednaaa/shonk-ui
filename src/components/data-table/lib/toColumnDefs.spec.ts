import type { DataTableColumn } from '../types';
import { flexRender, useTable } from '@tanstack/vue-table';
import { selectColumn } from '../columns/selectColumn';
import { features } from './features';
import { toColumnDefs } from './toColumnDefs';

interface Person {
  id: string;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: 'ada', name: 'Ada', age: 36 },
  { id: 'linus', name: 'Linus', age: 54 },
];

function buildTable(columns: DataTableColumn<Person>[]) {
  return useTable({ features, columns: toColumnDefs(columns), data: people });
}

function renderFirstRow(columns: DataTableColumn<Person>[]) {
  const [firstRow] = buildTable(columns).getRowModel().rows;

  return firstRow?.getVisibleCells().map(cell => flexRender(cell.column.columnDef.cell, cell.getContext()));
}

describe('toColumnDefs', () => {
  it('should read a value by key and name the column after it', () => {
    const table = buildTable([{ accessorKey: 'name', header: 'Name' }]);

    expect(table.getColumn('name')?.columnDef.header).toBe('Name');
    expect(renderFirstRow([{ accessorKey: 'name' }])).toEqual(['Ada']);
  });

  it('should let an explicit id win over the key', () => {
    const table = buildTable([{ id: 'fullName', accessorKey: 'name' }]);

    expect(table.getAllLeafColumns().map(column => column.id)).toEqual(['fullName']);
  });

  it('should read a value through a function', () => {
    expect(renderFirstRow([{ id: 'nextAge', accessorFn: person => person.age + 1 }])).toEqual(['37']);
  });

  it('should pass the row data and the value to the cell', () => {
    const cells = renderFirstRow([
      { accessorKey: 'name', cell: ({ row, value }) => `${row.id}:${value}` },
      { id: 'nextAge', accessorFn: person => person.age + 1, cell: ({ row, value }) => `${row.name}:${String(value)}` },
      { id: 'actions', cell: ({ row, value }) => `${row.age}:${String(value)}` },
    ]);

    expect(cells).toEqual(['ada:Ada', 'Ada:37', '36:undefined']);
  });

  it('should nest the columns of a group under its header', () => {
    const table = buildTable([
      { accessorKey: 'id' },
      { id: 'person', header: 'Person', columns: [{ accessorKey: 'name' }, { accessorKey: 'age' }] },
    ]);

    const [groupRow, leafRow] = table.getHeaderGroups();

    expect(groupRow?.headers.map(header => [header.column.columnDef.header, header.colSpan])).toEqual([
      [undefined, 1],
      ['Person', 2],
    ]);
    expect(leafRow?.headers.map(header => header.column.id)).toEqual(['id', 'name', 'age']);
  });

  it('should let only the sortable columns sort', () => {
    const table = buildTable([
      { accessorKey: 'name', sortable: true },
      { accessorKey: 'age' },
      { id: 'nextAge', accessorFn: person => person.age + 1, sortable: true },
    ]);

    expect(table.getAllLeafColumns().map(column => [column.id, column.getCanSort()])).toEqual([
      ['name', true],
      ['age', false],
      ['nextAge', true],
    ]);
  });

  it('should name a column by its label and fall back to its header', () => {
    const table = buildTable([
      { accessorKey: 'name', header: 'Name', label: 'Employee name' },
      { accessorKey: 'age', header: 'Age' },
    ]);

    expect(table.getAllLeafColumns().map(column => column.columnDef.meta?.label)).toEqual(['Employee name', 'Age']);
  });

  it('should let a column opt out of hiding', () => {
    const table = buildTable([{ accessorKey: 'name', hideable: false }, { accessorKey: 'age' }]);

    expect(table.getAllLeafColumns().map(column => [column.id, column.getCanHide()])).toEqual([
      ['name', false],
      ['age', true],
    ]);
  });

  it('should keep the select column from sorting and hiding', () => {
    const column = buildTable([selectColumn(), { accessorKey: 'name' }]).getColumn('select');

    expect(column?.getCanSort()).toBe(false);
    expect(column?.getCanHide()).toBe(false);
  });

  it('should keep the column classes for the renderer', () => {
    const table = buildTable([
      { accessorKey: 'age', class: 'text-right', headerClass: 'w-20' },
      { id: 'person', headerClass: 'text-center', columns: [{ accessorKey: 'name' }] },
    ]);

    expect(table.getColumn('age')?.columnDef.meta).toEqual({ class: 'text-right', headerClass: 'w-20' });
    expect(table.getColumn('person')?.columnDef.meta).toEqual({ headerClass: 'text-center' });
  });
});
