<script setup lang="ts">
import { useLocale } from '@/locales';

defineProps<{ empty?: boolean }>();

const locale = useLocale();
</script>

<template>
	<div role="listbox" class="max-h-60 overflow-y-auto py-1">
		<p v-if="empty" class="px-3 py-2 text-sm text-muted-foreground">
			{{ locale.filteredSearch.emptyText }}
		</p>
		<slot />
	</div>
</template>
