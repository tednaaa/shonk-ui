<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from '@lucide/vue';
import { usePreferredReducedMotion } from '@vueuse/core';
import { nextTick, useTemplateRef } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../../button';
import { useCard } from './cardsContext';
import DataTableCardCell from './DataTableCardCell.vue';

const props = defineProps<{
	limit?: number;
	class?: HTMLAttributes['class'];
}>();

const locale = useLocale();

const { fields, hiddenFields, expanded, toggleExpanded, sortOf, label } = useCard({ fieldLimit: () => props.limit });

const root = useTemplateRef('root');

const reducedMotion = usePreferredReducedMotion();

async function toggle() {
	const collapsing = expanded.value;

	toggleExpanded();

	if (!collapsing)
		return;

	await nextTick();

	const card = root.value?.closest('[data-slot="data-table-cards-item"]') ?? root.value;

	card?.scrollIntoView({ block: 'nearest', behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth' });
}
</script>

<template>
	<div
		v-if="fields.length > 0 || hiddenFields.length > 0"
		ref="root"
		data-slot="data-table-card-fields"
		:class="cn('flex flex-col items-start gap-1', props.class)"
	>
		<dl
			v-if="fields.length > 0"
			class="w-full divide-y overflow-hidden rounded-md border text-sm"
		>
			<div
				v-for="cell in fields"
				:key="cell.id"
				:class="cn('flex min-h-9 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 px-3 py-1.5', sortOf(cell.column.id) && 'bg-muted/60')"
			>
				<dt :class="cn('flex shrink-0 items-center gap-1', sortOf(cell.column.id) ? 'text-foreground' : 'text-muted-foreground')">
					{{ label(cell) }}
					<ArrowDownIcon
						v-if="sortOf(cell.column.id)?.desc"
						class="size-3.5 text-primary"
						:aria-label="locale.dataTable.sortedDescendingLabel"
					/>
					<ArrowUpIcon
						v-else-if="sortOf(cell.column.id)"
						class="size-3.5 text-primary"
						:aria-label="locale.dataTable.sortedAscendingLabel"
					/>
				</dt>
				<dd :class="cn('ml-auto min-w-0 text-right wrap-break-word tabular-nums', sortOf(cell.column.id) && 'font-semibold')">
					<DataTableCardCell :column="cell.column.id" />
				</dd>
			</div>
		</dl>
		<div
			v-if="hiddenFields.length > 0"
			:class="cn('self-stretch', expanded && 'sticky bottom-0 bg-background py-1')"
		>
			<Button
				variant="ghost"
				size="sm"
				class="text-muted-foreground"
				:aria-expanded="expanded"
				@click="toggle"
			>
				<ChevronUpIcon v-if="expanded" />
				<ChevronDownIcon v-else />
				{{ expanded ? locale.dataTable.cardShowLessText : locale.dataTable.cardShowMoreText(hiddenFields.length) }}
			</Button>
		</div>
	</div>
</template>
