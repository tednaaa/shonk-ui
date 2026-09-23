<script setup lang="ts">
import type { DataTableColumn, DataTableExportFormat, DataTablePaginationState } from 'shonk-ui';
import { DownloadIcon } from '@lucide/vue';
import {
  Button,
  DataTable,
  DataTableExport,
  DataTablePagination,
  DataTablePaginationPages,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useDataTable,
  useDataTableExport,
} from 'shonk-ui';
import { ref } from 'vue';
import { StorybookLabel } from '@/lib/storybook';

interface Order {
  id: string;
  client: string;
  country: string;
  createdAt: string;
  amount: number;
  paid: boolean;
}

interface Customer {
  id: string;
  representative: string;
  name: string;
  country: string;
  company: string;
}

interface OperatorPlan {
  id: string;
  operator: string;
  plan: number;
  fact: number;
  niches: Record<string, number>;
}

const deals = [
  { client: 'James Butt', country: 'Algeria', createdAt: '2026-01-14', amount: 1200, paid: true },
  { client: 'Josephine Darakjy', country: 'Egypt', createdAt: '2026-01-19', amount: 3400, paid: true },
  { client: 'Art Venere', country: 'Panama', createdAt: '2026-02-02', amount: 780, paid: false },
  { client: 'Lenna Paprocki', country: 'Slovenia', createdAt: '2026-02-11', amount: 5600, paid: true },
  { client: 'Donette Foller', country: 'South Africa', createdAt: '2026-02-23', amount: 240, paid: false },
  { client: 'Simona Morasca', country: 'Egypt', createdAt: '2026-03-04', amount: 8900, paid: true },
  { client: 'Mitsue Tollner', country: 'Paraguay', createdAt: '2026-03-15', amount: 1750, paid: false },
  { client: 'Leota Dilliard', country: 'Serbia', createdAt: '2026-03-27', amount: 430, paid: true },
  { client: 'Sage Wieser', country: 'Egypt', createdAt: '2026-04-06', amount: 2680, paid: true },
  { client: 'Kris Marrier', country: 'Mexico', createdAt: '2026-04-18', amount: 940, paid: false },
  { client: 'Minna Amigon', country: 'Romania', createdAt: '2026-04-29', amount: 6100, paid: true },
  { client: 'Abel Maclead', country: 'Singapore', createdAt: '2026-05-08', amount: 1390, paid: true },
];

const accounts = [
  { representative: 'Amy Elsner', name: 'James Butt', country: 'Algeria', company: 'Benton, John B Jr' },
  { representative: 'Amy Elsner', name: 'Josephine Darakjy', country: 'Egypt', company: 'Chanay, Jeffrey A Esq' },
  { representative: 'Amy Elsner', name: 'Art Venere', country: 'Panama', company: 'Chemel, James L Cpa' },
  { representative: 'Anna Fali', name: 'Lenna Paprocki', country: 'Slovenia', company: 'Feltz Printing Service' },
  { representative: 'Anna Fali', name: 'Donette Foller', country: 'South Africa', company: 'Printing Dimensions' },
  { representative: 'Asiya Javayant', name: 'Simona Morasca', country: 'Egypt', company: 'Chapman, Ross E Esq' },
  { representative: 'Asiya Javayant', name: 'Mitsue Tollner', country: 'Paraguay', company: 'Morlong Associates' },
  { representative: 'Asiya Javayant', name: 'Leota Dilliard', country: 'Serbia', company: 'Commercial Press' },
];

const niches = [
  { id: 'real-estate', name: 'Real estate' },
  { id: 'dentistry', name: 'Dentistry' },
  { id: 'car-service', name: 'Car service' },
  { id: 'legal', name: 'Legal' },
  { id: 'windows', name: 'Windows' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'tourism', name: 'Tourism' },
  { id: 'education', name: 'Education' },
];

const operatorNames = ['Anna Petrova', 'Boris Ivanov', 'Vera Smirnova', 'Gleb Kuznetsov', 'Daria Popova', 'Egor Sokolov'];

const orders: Order[] = deals.map((deal, index) => ({ id: String(index + 1), ...deal }));

const customers: Customer[] = accounts.map((account, index) => ({ id: String(index + 1), ...account }));

const operators: OperatorPlan[] = operatorNames.map((operator, index) => {
  const nicheCounts = Object.fromEntries(niches.map((niche, nicheIndex) => [niche.id, (index * 5 + nicheIndex * 3) % 12]));

  return {
    id: String(index + 1),
    operator,
    plan: 40 + (index * 7) % 30,
    fact: Object.values(nicheCounts).reduce((sum, count) => sum + count, 0),
    niches: nicheCounts,
  };
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const numeric = { class: 'text-right tabular-nums', headerClass: 'text-right' };

function formatDay(value: string) {
  return day.format(new Date(value));
}

function total(plans: OperatorPlan[], count: (plan: OperatorPlan) => number) {
  return plans.reduce((sum, plan) => sum + count(plan), 0);
}

function difference(plan: OperatorPlan) {
  return plan.fact - plan.plan;
}

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

const orderColumns: DataTableColumn<Order>[] = [
  { accessorKey: 'client', header: 'Client', class: 'font-medium' },
  { accessorKey: 'country', header: 'Country' },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ value }) => formatDay(value),
    exportValue: ({ value }) => formatDay(value),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ value }) => currency.format(value),
    exportValue: ({ value }) => value,
    ...numeric,
  },
  {
    accessorKey: 'paid',
    header: 'Paid',
    cell: ({ value }) => value ? '✓' : '—',
    exportValue: ({ value }) => value ? 'Paid' : 'Unpaid',
  },
];

const customerColumns: DataTableColumn<Customer>[] = [
  { accessorKey: 'representative', header: 'Representative', spanRows: true, class: 'font-medium' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'country', header: 'Country' },
  { accessorKey: 'company', header: 'Company' },
];

const operatorColumns: DataTableColumn<OperatorPlan>[] = [
  { accessorKey: 'operator', header: 'Operator', footer: 'Total', pinned: true, class: 'font-medium' },
  { accessorKey: 'plan', header: 'Plan', footer: ({ rows }) => total(rows, plan => plan.plan), pinned: true, ...numeric },
  {
    id: 'september',
    header: 'September',
    columns: [
      { accessorKey: 'fact', header: 'Fact', footer: ({ rows }) => total(rows, plan => plan.fact), ...numeric },
      {
        id: 'difference',
        header: 'Difference',
        accessorFn: difference,
        cell: ({ row }) => signed(difference(row)),
        exportValue: ({ row }) => signed(difference(row)),
        footer: ({ rows }) => signed(total(rows, difference)),
        ...numeric,
      },
    ],
  },
  ...niches.map((niche): DataTableColumn<OperatorPlan> => ({
    id: niche.id,
    header: niche.name,
    accessorFn: plan => plan.niches[niche.id] ?? 0,
    footer: ({ rows }) => total(rows, plan => plan.niches[niche.id] ?? 0),
    ...numeric,
  })),
];

const pagination = ref<DataTablePaginationState>({ pageIndex: 0, pageSize: 5 });

const ordersTable = useDataTable({ data: orders, columns: orderColumns, getRowId: order => order.id, pagination });

const customersTable = useDataTable({ data: customers, columns: customerColumns, getRowId: customer => customer.id });

const operatorsTable = useDataTable({ data: operators, columns: operatorColumns, getRowId: plan => plan.id });

const orderFormat = ref<DataTableExportFormat>('csv');

const customerFormat = ref<DataTableExportFormat>('csv');

const operatorFormat = ref<DataTableExportFormat>('csv');

const { downloadTable: downloadOrders } = useDataTableExport(ordersTable, { fileName: 'orders', sheetName: 'Orders' });

const { downloadTable: downloadCustomers } = useDataTableExport(customersTable, { fileName: 'customers', sheetName: 'Customers' });

const { downloadTable: downloadOperators } = useDataTableExport(operatorsTable, { fileName: 'operators', sheetName: 'Operators' });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-10">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <p class="font-mono text-sm">orders.csv · orders.xlsx</p>

        <p class="text-sm text-muted-foreground">
          Current page only. Amount as a number, date as the table shows it, tick as a word.
        </p>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <StorybookLabel>Both formats</StorybookLabel>
          <DataTableExport
            :table="ordersTable"
            file-name="orders"
            sheet-name="Orders"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>CSV only</StorybookLabel>
          <DataTableExport
            :table="ordersTable"
            :formats="['csv']"
            file-name="orders"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>XLSX only</StorybookLabel>
          <DataTableExport
            :table="ordersTable"
            :formats="['xlsx']"
            file-name="orders"
            sheet-name="Orders"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>Own UI on useDataTableExport</StorybookLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="secondary">
                <DownloadIcon />
                Download report
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              class="flex w-60 flex-col gap-3"
            >
              <p class="font-mono text-sm">orders.{{ orderFormat }}</p>

              <Select v-model="orderFormat">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>

              <PopoverClose as-child>
                <Button @click="downloadOrders(orderFormat)">
                  <DownloadIcon />
                  Download report
                </Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>Nothing to export</StorybookLabel>
          <DataTableExport
            :table="ordersTable"
            disabled
            file-name="orders"
            sheet-name="Orders"
          />
        </div>
      </div>

      <DataTable :table="ordersTable" />

      <DataTablePagination :table="ordersTable">
        <DataTablePaginationPages />
      </DataTablePagination>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <p class="font-mono text-sm">customers.csv · customers.xlsx</p>

        <p class="text-sm text-muted-foreground">
          A merged cell repeats in every row it covers.
        </p>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <StorybookLabel>Both formats</StorybookLabel>
          <DataTableExport
            :table="customersTable"
            file-name="customers"
            sheet-name="Customers"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>CSV only</StorybookLabel>
          <DataTableExport
            :table="customersTable"
            :formats="['csv']"
            file-name="customers"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>XLSX only</StorybookLabel>
          <DataTableExport
            :table="customersTable"
            :formats="['xlsx']"
            file-name="customers"
            sheet-name="Customers"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>Own UI on useDataTableExport</StorybookLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="secondary">
                <DownloadIcon />
                Download report
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              class="flex w-60 flex-col gap-3"
            >
              <p class="font-mono text-sm">customers.{{ customerFormat }}</p>

              <Select v-model="customerFormat">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>

              <PopoverClose as-child>
                <Button @click="downloadCustomers(customerFormat)">
                  <DownloadIcon />
                  Download report
                </Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <DataTable :table="customersTable" />
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <p class="font-mono text-sm">operators.csv · operators.xlsx</p>

        <p class="text-sm text-muted-foreground">
          Every column in table order, pinned first and scrolled-away too. A group header joins the name: September / Fact. Totals stay behind.
        </p>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <StorybookLabel>Both formats</StorybookLabel>
          <DataTableExport
            :table="operatorsTable"
            file-name="operators"
            sheet-name="Operators"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>CSV only</StorybookLabel>
          <DataTableExport
            :table="operatorsTable"
            :formats="['csv']"
            file-name="operators"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>XLSX only</StorybookLabel>
          <DataTableExport
            :table="operatorsTable"
            :formats="['xlsx']"
            file-name="operators"
            sheet-name="Operators"
          />
        </div>

        <div class="flex flex-col gap-1">
          <StorybookLabel>Own UI on useDataTableExport</StorybookLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="secondary">
                <DownloadIcon />
                Download report
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              class="flex w-60 flex-col gap-3"
            >
              <p class="font-mono text-sm">operators.{{ operatorFormat }}</p>

              <Select v-model="operatorFormat">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>

              <PopoverClose as-child>
                <Button @click="downloadOperators(operatorFormat)">
                  <DownloadIcon />
                  Download report
                </Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <DataTable
        :table="operatorsTable"
        class="max-h-120"
      />
    </div>
  </div>
</template>
