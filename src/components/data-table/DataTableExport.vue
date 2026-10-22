<script setup lang="ts" generic="TData extends object">
import type { DataTableExportFormat, DataTableInstance } from './types';
import type { ShonkLocale } from '@/locales';
import { DownloadIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { Button } from '../button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown-menu';
import { useDataTableExport } from './useDataTableExport';

const props = defineProps<{
	table: DataTableInstance<TData>;
	fileName?: string;
	sheetName?: string;
	formats?: DataTableExportFormat[];
	disabled?: boolean;
	locale?: Partial<ShonkLocale['dataTable']>;
}>();

const locale = useLocale(() => ({ dataTable: props.locale }));

const formats = computed<DataTableExportFormat[]>(() => props.formats ?? ['csv', 'xlsx']);

const { downloadTable } = useDataTableExport(() => props.table, {
	fileName: () => props.fileName ?? locale.value.dataTable.exportFileName,
	sheetName: () => props.sheetName,
});

function formatLabel(format: DataTableExportFormat) {
	return format.toUpperCase();
}
</script>

<template>
	<Button
		v-if="formats.length === 1"
		variant="secondary"
		:disabled="disabled"
		@click="downloadTable(formats[0])"
	>
		<DownloadIcon />
		{{ locale.dataTable.exportButtonText }} {{ formatLabel(formats[0]) }}
	</Button>

	<DropdownMenu v-else>
		<DropdownMenuTrigger as-child>
			<Button
				variant="secondary"
				:disabled="disabled"
			>
				<DownloadIcon />
				{{ locale.dataTable.exportButtonText }}
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem
				v-for="format in formats"
				:key="format"
				@select="downloadTable(format)"
			>
				{{ formatLabel(format) }}
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
