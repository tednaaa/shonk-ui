<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { DataTable, useDataTable } from 'shonk-ui';

interface Niche {
  id: string;
  name: string;
}

interface OperatorPlan {
  id: string;
  operator: string;
  plan: number;
  fact: number;
  niches: Record<string, number>;
}

const niches: Niche[] = [
  { id: 'real-estate', name: 'Real estate' },
  { id: 'dentistry', name: 'Dentistry' },
  { id: 'car-service', name: 'Car service' },
  { id: 'legal', name: 'Legal' },
  { id: 'windows', name: 'Windows' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'tourism', name: 'Tourism' },
  { id: 'education', name: 'Education' },
];

const operatorNames = [
  'Anna Petrova',
  'Boris Ivanov',
  'Vera Smirnova',
  'Gleb Kuznetsov',
  'Daria Popova',
  'Egor Sokolov',
  'Zoya Lebedeva',
  'Ilya Kozlov',
  'Kira Novikova',
  'Lev Morozov',
  'Maria Volkova',
  'Nikita Solovyov',
  'Olga Vasilyeva',
  'Pavel Zaitsev',
  'Raisa Pavlova',
  'Semyon Semenov',
  'Taisia Golubeva',
  'Ulyana Vinogradova',
  'Fedor Bogdanov',
  'Yana Vorobyova',
];

const rows: OperatorPlan[] = operatorNames.map((operator, index) => {
  const nicheCounts = Object.fromEntries(niches.map((niche, nicheIndex) => [niche.id, (index * 5 + nicheIndex * 3) % 12]));

  return {
    id: String(index + 1),
    operator,
    plan: 40 + (index * 7) % 30,
    fact: Object.values(nicheCounts).reduce((total, count) => total + count, 0),
    niches: nicheCounts,
  };
});

function total(operators: OperatorPlan[], count: (operator: OperatorPlan) => number) {
  return operators.reduce((sum, operator) => sum + count(operator), 0);
}

function difference(operator: OperatorPlan) {
  return operator.fact - operator.plan;
}

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

const numeric = { class: 'text-right tabular-nums', headerClass: 'text-right' };

const columns: DataTableColumn<OperatorPlan>[] = [
  { accessorKey: 'operator', header: 'Operator', footer: 'Total', pinned: true, class: 'font-medium' },
  { accessorKey: 'plan', header: 'Plan', footer: ({ rows }) => total(rows, operator => operator.plan), pinned: true, sortable: true, ...numeric },
  {
    id: 'september',
    header: 'September',
    columns: [
      { accessorKey: 'fact', header: 'Fact', footer: ({ rows }) => total(rows, operator => operator.fact), sortable: true, ...numeric },
      {
        id: 'difference',
        header: 'Difference',
        accessorFn: difference,
        cell: ({ row }) => signed(difference(row)),
        footer: ({ rows }) => signed(total(rows, difference)),
        sortable: true,
        ...numeric,
      },
    ],
  },
  ...niches.map((niche): DataTableColumn<OperatorPlan> => ({
    id: niche.id,
    header: niche.name,
    accessorFn: operator => operator.niches[niche.id] ?? 0,
    footer: ({ rows }) => total(rows, operator => operator.niches[niche.id] ?? 0),
    ...numeric,
  })),
];

const table = useDataTable({ data: rows, columns, getRowId: operator => operator.id });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Operator and plan stay in place while the table scrolls sideways, the headers and the totals stay while it scrolls down. The totals count the rows on the page.
    </p>

    <DataTable
      :table="table"
      class="max-h-120"
    />
  </div>
</template>
