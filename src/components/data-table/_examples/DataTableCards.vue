<script setup lang="ts">
import type { DataTableColumn, DataTableSortingState } from 'shonk-ui';
import { StarIcon } from '@lucide/vue';
import { Button, DataTable, DataTableColumnToggle, selectColumn, useDataTable, useStoredColumnVisibility } from 'shonk-ui';
import { h, ref } from 'vue';

interface Market {
	id: string;
	symbol: string;
	favorite: boolean;
	price: number;
	volume: number;
	change: number;
	volatility: number;
	spread: number;
	exchange: string;
}

const symbols = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'DOT', 'BABYDOGE1000000'];
const exchanges = ['Binance', 'Bybit', 'OKX'];

const markets = ref<Market[]>(symbols.map((symbol, index) => ({
	id: symbol,
	symbol: `${symbol}USDT`,
	favorite: index % 3 === 0,
	price: Math.round(1000 / (index + 1)) / 10,
	volume: (index + 2) * 13_450_000,
	change: ((index * 37) % 21) - 10,
	volatility: ((index * 17) % 9) + 1.5,
	spread: ((index * 11) % 7) / 100,
	exchange: exchanges[index % exchanges.length] ?? '',
})));

function toggleFavorite(market: Market) {
	market.favorite = !market.favorite;
}

const columns: DataTableColumn<Market>[] = [
	selectColumn(),
	{
		id: 'favorite',
		header: '',
		label: 'Favorite',
		hideable: false,
		cell: ({ row }) => h(Button, {
			'variant': 'ghost',
			'size': 'icon-sm',
			'aria-label': 'Favorite',
			'aria-pressed': row.favorite,
			'onClick': () => toggleFavorite(row),
		}, () => h(StarIcon, { class: row.favorite ? 'fill-current' : undefined })),
	},
	{ accessorKey: 'symbol', header: 'Symbol', hideable: false, sortable: true },
	{ accessorKey: 'price', header: 'Price', class: 'text-right', headerClass: 'text-right', sortable: true, sortDescFirst: true },
	{ accessorKey: 'volume', header: 'Volume', class: 'text-right', headerClass: 'text-right', sortable: true, sortDescFirst: true, cell: ({ value }) => value.toLocaleString('en-US') },
	{ accessorKey: 'change', header: 'Change, %', class: 'text-right', headerClass: 'text-right', sortable: true, sortDescFirst: true },
	{ accessorKey: 'volatility', header: 'Volatility', class: 'text-right', headerClass: 'text-right', sortable: true, sortDescFirst: true },
	{ accessorKey: 'spread', header: 'Spread', class: 'text-right', headerClass: 'text-right', sortable: true },
	{ accessorKey: 'exchange', header: 'Exchange', card: 'hidden' },
];

const sorting = ref<DataTableSortingState>([{ id: 'volatility', desc: true }]);

const columnVisibility = useStoredColumnVisibility('shonk-ui-example-market-columns', columns);

const table = useDataTable({
	data: markets,
	columns,
	sorting,
	enableMultiSort: true,
	columnVisibility,
	getRowId: market => market.id,
});
</script>

<template>
	<div class="flex max-w-3xl flex-col gap-4">
		<div class="flex min-h-8 items-center justify-between gap-4">
			<p class="text-sm text-muted-foreground">
				Below 640px the table turns into cards. The toggle picks the card fields there, sorted fields come first.
			</p>
			<DataTableColumnToggle :table="table" />
		</div>

		<DataTable
			:table="table"
			cards-below="sm"
			:card-fields="3"
		/>
	</div>
</template>
