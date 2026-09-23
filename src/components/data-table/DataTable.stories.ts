import type { ComponentPropsAndSlots, Meta, StoryObj } from '@storybook/vue3-vite';
import type { FunctionalComponent } from 'vue';
import { example, render } from '@/lib/storybook';
import { DataTable } from '.';
import DataTableBasic from './examples/DataTableBasic.vue';
import dataTableBasicSource from './examples/DataTableBasic.vue?raw';
import DataTableClientSorting from './examples/DataTableClientSorting.vue';
import dataTableClientSortingSource from './examples/DataTableClientSorting.vue?raw';
import DataTableColumnToggle from './examples/DataTableColumnToggle.vue';
import dataTableColumnToggleSource from './examples/DataTableColumnToggle.vue?raw';
import DataTableEmpty from './examples/DataTableEmpty.vue';
import dataTableEmptySource from './examples/DataTableEmpty.vue?raw';
import DataTableInfiniteLoading from './examples/DataTableInfiniteLoading.vue';
import dataTableInfiniteLoadingSource from './examples/DataTableInfiniteLoading.vue?raw';
import DataTableLoading from './examples/DataTableLoading.vue';
import dataTableLoadingSource from './examples/DataTableLoading.vue?raw';
import DataTablePaginationVariants from './examples/DataTablePaginationVariants.vue';
import dataTablePaginationVariantsSource from './examples/DataTablePaginationVariants.vue?raw';
import DataTablePinnedColumns from './examples/DataTablePinnedColumns.vue';
import dataTablePinnedColumnsSource from './examples/DataTablePinnedColumns.vue?raw';
import DataTableRowClick from './examples/DataTableRowClick.vue';
import dataTableRowClickSource from './examples/DataTableRowClick.vue?raw';
import DataTableRowExpansion from './examples/DataTableRowExpansion.vue';
import dataTableRowExpansionSource from './examples/DataTableRowExpansion.vue?raw';
import DataTableRowSelection from './examples/DataTableRowSelection.vue';
import dataTableRowSelectionSource from './examples/DataTableRowSelection.vue?raw';
import DataTableServerMultiSorting from './examples/DataTableServerMultiSorting.vue';
import dataTableServerMultiSortingSource from './examples/DataTableServerMultiSorting.vue?raw';
import DataTableServerPageSize from './examples/DataTableServerPageSize.vue';
import dataTableServerPageSizeSource from './examples/DataTableServerPageSize.vue?raw';
import DataTableServerPaginationOnTop from './examples/DataTableServerPaginationOnTop.vue';
import dataTableServerPaginationOnTopSource from './examples/DataTableServerPaginationOnTop.vue?raw';
import DataTableStoredColumns from './examples/DataTableStoredColumns.vue';
import dataTableStoredColumnsSource from './examples/DataTableStoredColumns.vue?raw';

const dataTableComponent: FunctionalComponent<ComponentPropsAndSlots<typeof DataTable>> = DataTable;

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: dataTableComponent,
  tags: ['autodocs'],
  parameters: example(dataTableBasicSource),
  render: render({ DataTableBasic }, `<DataTableBasic />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Empty: Story = {
  parameters: example(dataTableEmptySource),
  render: render({ DataTableEmpty }, `<DataTableEmpty />`),
};

export const Loading: Story = {
  parameters: example(dataTableLoadingSource),
  render: render({ DataTableLoading }, `<DataTableLoading />`),
};

export const RowClick: Story = {
  parameters: example(dataTableRowClickSource),
  render: render({ DataTableRowClick }, `<DataTableRowClick />`),
};

export const ClientSorting: Story = {
  parameters: example(dataTableClientSortingSource),
  render: render({ DataTableClientSorting }, `<DataTableClientSorting />`),
};

export const ServerMultiSorting: Story = {
  parameters: example(dataTableServerMultiSortingSource),
  render: render({ DataTableServerMultiSorting }, `<DataTableServerMultiSorting />`),
};

export const ServerPaginationOnTop: Story = {
  parameters: example(dataTableServerPaginationOnTopSource),
  render: render({ DataTableServerPaginationOnTop }, `<DataTableServerPaginationOnTop />`),
};

export const ServerPageSize: Story = {
  parameters: example(dataTableServerPageSizeSource),
  render: render({ DataTableServerPageSize }, `<DataTableServerPageSize />`),
};

export const PaginationVariants: Story = {
  parameters: example(dataTablePaginationVariantsSource),
  render: render({ DataTablePaginationVariants }, `<DataTablePaginationVariants />`),
};

export const InfiniteLoading: Story = {
  parameters: example(dataTableInfiniteLoadingSource),
  render: render({ DataTableInfiniteLoading }, `<DataTableInfiniteLoading />`),
};

export const RowSelection: Story = {
  parameters: example(dataTableRowSelectionSource),
  render: render({ DataTableRowSelection }, `<DataTableRowSelection />`),
};

export const ColumnToggle: Story = {
  parameters: example(dataTableColumnToggleSource),
  render: render({ DataTableColumnToggle }, `<DataTableColumnToggle />`),
};

export const StoredColumns: Story = {
  parameters: example(dataTableStoredColumnsSource),
  render: render({ DataTableStoredColumns }, `<DataTableStoredColumns />`),
};

export const PinnedColumns: Story = {
  parameters: example(dataTablePinnedColumnsSource),
  render: render({ DataTablePinnedColumns }, `<DataTablePinnedColumns />`),
};

export const RowExpansion: Story = {
  parameters: example(dataTableRowExpansionSource),
  render: render({ DataTableRowExpansion }, `<DataTableRowExpansion />`),
};
