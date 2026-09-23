<script setup lang="ts">
import type { ActiveFilter } from './types';
import { XIcon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { filterTokenVariants } from './variants';

withDefaults(defineProps<{ filter: ActiveFilter; removable?: boolean }>(), { removable: true });

const emit = defineEmits<{ remove: [id: string] }>();

const locale = useLocale();
</script>

<template>
  <span :class="filterTokenVariants({ removable })">
    <span class="shrink-0 truncate font-medium">{{ filter.keyLabel }}</span>
    <span class="shrink-0 text-muted-foreground">{{ filter.operatorLabel }}</span>
    <span class="truncate">{{ filter.valueLabel }}</span>
    <button
      v-if="removable"
      class="ml-0.5 shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:bg-accent hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      :aria-label="locale.filteredSearch.removeFilterButtonAriaLabel(filter.keyLabel)"
      @click.stop="emit('remove', filter.id)"
    >
      <XIcon class="size-3" />
    </button>
  </span>
</template>
