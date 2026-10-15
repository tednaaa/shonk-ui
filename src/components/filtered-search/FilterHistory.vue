<script setup lang="ts">
import type { FilterHistoryItem } from './types';
import { HistoryIcon } from '@lucide/vue';
import { ref } from 'vue';
import { useLocale } from '@/locales';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import FilterToken from './FilterToken.vue';

defineProps<{ items: FilterHistoryItem[] }>();

const emit = defineEmits<{ select: [item: FilterHistoryItem]; clear: [] }>();

const locale = useLocale();
const isOpen = ref(false);

function itemLabel(item: FilterHistoryItem) {
	const tokens = item.filters.map(filter => `${filter.keyLabel} ${filter.operatorLabel} ${filter.valueLabel}`);
	return [...tokens, item.searchText].filter(Boolean).join(' ');
}

function select(item: FilterHistoryItem) {
	isOpen.value = false;
	emit('select', item);
}

function clear() {
	isOpen.value = false;
	emit('clear');
}
</script>

<template>
	<Popover v-model:open="isOpen">
		<PopoverTrigger as-child>
			<Button
				variant="secondary"
				class="h-auto w-10 shrink-0"
				:aria-label="locale.filteredSearch.historyButtonAriaLabel"
			>
				<HistoryIcon class="size-4" />
			</Button>
		</PopoverTrigger>

		<PopoverContent class="min-w-70 overflow-hidden p-0" align="start" :side-offset="12">
			<p class="border-b px-3 py-2 text-xs text-muted-foreground">
				{{ locale.filteredSearch.historyHeaderText }}
			</p>

			<p v-if="items.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
				{{ locale.filteredSearch.historyEmptyText }}
			</p>

			<div v-else class="max-h-60 overflow-y-auto py-1">
				<button
					v-for="(item, index) in items"
					:key="index"
					class="w-full px-3 py-1.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
					:aria-label="locale.filteredSearch.historyItemAriaLabel(itemLabel(item))"
					@click="select(item)"
				>
					<span class="flex flex-wrap items-center gap-1.5">
						<FilterToken
							v-for="filter in item.filters"
							:key="filter.id"
							:filter="filter"
							:removable="false"
						/>
						<span v-if="item.searchText" class="text-sm">{{ item.searchText }}</span>
					</span>
				</button>
			</div>

			<div v-if="items.length > 0" class="border-t p-1">
				<Button variant="ghost" size="sm" class="w-full justify-start" @click="clear">
					{{ locale.filteredSearch.clearHistoryButtonText }}
				</Button>
			</div>
		</PopoverContent>
	</Popover>
</template>
