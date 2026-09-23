<script setup lang="ts">
import type { ActiveFilter } from './types';
import { XIcon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

withDefaults(defineProps<{ filter: ActiveFilter; removable?: boolean }>(), { removable: true });

const emit = defineEmits<{ remove: [id: string] }>();

const locale = useLocale();
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1 rounded-md border border-border bg-accent/50 text-accent-foreground text-xs h-6 pl-2 shrink-0',
      removable ? 'pr-1' : 'pr-2',
    )"
  >
    <span class="font-medium truncate shrink-0">{{ filter.keyLabel }}</span>
    <span class="text-muted-foreground shrink-0">{{ filter.operatorLabel }}</span>
    <span class="truncate">{{ filter.valueLabel }}</span>
    <button
      v-if="removable"
      class="ml-0.5 rounded p-0.5 opacity-60 hover:opacity-100 hover:bg-accent transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
      :aria-label="locale.filteredSearch.removeFilterButtonAriaLabel(filter.keyLabel)"
      @click.stop="emit('remove', filter.id)"
    >
      <XIcon class="size-3" />
    </button>
  </span>
</template>
