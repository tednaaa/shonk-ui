import type { ComponentPropsAndSlots, Meta, StoryObj } from '@storybook/vue3-vite';
import type { FunctionalComponent } from 'vue';
import { example, render } from '@/lib/storybook';
import { DataTable } from '.';
import DataTableBasic from './examples/DataTableBasic.vue';
import dataTableBasicSource from './examples/DataTableBasic.vue?raw';
import DataTableClientSorting from './examples/DataTableClientSorting.vue';
import dataTableClientSortingSource from './examples/DataTableClientSorting.vue?raw';
import DataTableEmpty from './examples/DataTableEmpty.vue';
import dataTableEmptySource from './examples/DataTableEmpty.vue?raw';
import DataTableLoading from './examples/DataTableLoading.vue';
import dataTableLoadingSource from './examples/DataTableLoading.vue?raw';
import DataTableRowClick from './examples/DataTableRowClick.vue';
import dataTableRowClickSource from './examples/DataTableRowClick.vue?raw';
import DataTableServerMultiSorting from './examples/DataTableServerMultiSorting.vue';
import dataTableServerMultiSortingSource from './examples/DataTableServerMultiSorting.vue?raw';

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
