import type { ComponentPropsAndSlots, Meta, StoryObj } from '@storybook/vue3-vite';
import type { FunctionalComponent } from 'vue';
import { example, render } from '@/lib/storybook';
import { DataTable } from '.';
import DataTableBasic from './_examples/DataTableBasic.vue';
import dataTableBasicSource from './_examples/DataTableBasic.vue?raw';
import DataTableCards from './_examples/DataTableCards.vue';
import dataTableCardsSource from './_examples/DataTableCards.vue?raw';
import DataTableClientSorting from './_examples/DataTableClientSorting.vue';
import dataTableClientSortingSource from './_examples/DataTableClientSorting.vue?raw';
import DataTableColumnResizing from './_examples/DataTableColumnResizing.vue';
import dataTableColumnResizingSource from './_examples/DataTableColumnResizing.vue?raw';
import DataTableColumnToggle from './_examples/DataTableColumnToggle.vue';
import dataTableColumnToggleSource from './_examples/DataTableColumnToggle.vue?raw';
import DataTableEmpty from './_examples/DataTableEmpty.vue';
import dataTableEmptySource from './_examples/DataTableEmpty.vue?raw';
import DataTableExport from './_examples/DataTableExport.vue';
import dataTableExportSource from './_examples/DataTableExport.vue?raw';
import DataTableInfiniteLoading from './_examples/DataTableInfiniteLoading.vue';
import dataTableInfiniteLoadingSource from './_examples/DataTableInfiniteLoading.vue?raw';
import DataTableLoading from './_examples/DataTableLoading.vue';
import dataTableLoadingSource from './_examples/DataTableLoading.vue?raw';
import DataTableMergedCells from './_examples/DataTableMergedCells.vue';
import dataTableMergedCellsSource from './_examples/DataTableMergedCells.vue?raw';
import DataTablePaginationVariants from './_examples/DataTablePaginationVariants.vue';
import dataTablePaginationVariantsSource from './_examples/DataTablePaginationVariants.vue?raw';
import DataTablePinnedColumns from './_examples/DataTablePinnedColumns.vue';
import dataTablePinnedColumnsSource from './_examples/DataTablePinnedColumns.vue?raw';
import DataTablePinnedRows from './_examples/DataTablePinnedRows.vue';
import dataTablePinnedRowsSource from './_examples/DataTablePinnedRows.vue?raw';
import DataTableRowClick from './_examples/DataTableRowClick.vue';
import dataTableRowClickSource from './_examples/DataTableRowClick.vue?raw';
import DataTableRowExpansion from './_examples/DataTableRowExpansion.vue';
import dataTableRowExpansionSource from './_examples/DataTableRowExpansion.vue?raw';
import DataTableRowSelection from './_examples/DataTableRowSelection.vue';
import dataTableRowSelectionSource from './_examples/DataTableRowSelection.vue?raw';
import DataTableServerMultiSorting from './_examples/DataTableServerMultiSorting.vue';
import dataTableServerMultiSortingSource from './_examples/DataTableServerMultiSorting.vue?raw';
import DataTableServerPageSize from './_examples/DataTableServerPageSize.vue';
import dataTableServerPageSizeSource from './_examples/DataTableServerPageSize.vue?raw';
import DataTableServerPaginationOnTop from './_examples/DataTableServerPaginationOnTop.vue';
import dataTableServerPaginationOnTopSource from './_examples/DataTableServerPaginationOnTop.vue?raw';
import DataTableStoredColumns from './_examples/DataTableStoredColumns.vue';
import dataTableStoredColumnsSource from './_examples/DataTableStoredColumns.vue?raw';

const dataTableComponent: FunctionalComponent<ComponentPropsAndSlots<typeof DataTable>> = DataTable;

const meta: Meta<typeof DataTable> = {
	title: 'Data/DataTable',
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

export const Cards: Story = {
	parameters: example(dataTableCardsSource),
	globals: { viewport: { value: 'mobile1', isRotated: false } },
	render: render({ DataTableCards }, `<DataTableCards />`),
};

export const PinnedColumns: Story = {
	parameters: example(dataTablePinnedColumnsSource),
	render: render({ DataTablePinnedColumns }, `<DataTablePinnedColumns />`),
};

export const ColumnResizing: Story = {
	parameters: example(dataTableColumnResizingSource),
	render: render({ DataTableColumnResizing }, `<DataTableColumnResizing />`),
};

export const RowExpansion: Story = {
	parameters: example(dataTableRowExpansionSource),
	render: render({ DataTableRowExpansion }, `<DataTableRowExpansion />`),
};

export const PinnedRows: Story = {
	parameters: example(dataTablePinnedRowsSource),
	render: render({ DataTablePinnedRows }, `<DataTablePinnedRows />`),
};

export const MergedCells: Story = {
	parameters: example(dataTableMergedCellsSource),
	render: render({ DataTableMergedCells }, `<DataTableMergedCells />`),
};

export const Export: Story = {
	parameters: example(dataTableExportSource),
	render: render({ DataTableExport }, `<DataTableExport />`),
};
