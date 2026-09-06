<script setup lang="ts">
import type { SwipeActionSide } from 'shonk-ui';
import { ArchiveIcon, Trash2Icon } from '@lucide/vue';
import { SwipeAction } from 'shonk-ui';
import { ref } from 'vue';

const items = ref(['Buy milk', 'Call the dentist', 'Renew passport']);
const lastAction = ref('Nothing yet');

function act(side: SwipeActionSide, index: number) {
  lastAction.value = `${side === 'left' ? 'Archived' : 'Deleted'} ${items.value[index]}`;
  items.value.splice(index, 1);
}
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm text-muted-foreground">{{ lastAction }}</p>

    <ul class="overflow-hidden rounded-md border border-border">
      <SwipeAction
        v-for="(item, index) in items"
        :key="item"
        as="li"
        left-action-aria-label="Archive"
        left-action-class="bg-secondary text-secondary-foreground"
        right-action-aria-label="Delete"
        class="border-b border-border last:border-b-0"
        @trigger="side => act(side, index)"
      >
        <template #left-action>
          <ArchiveIcon />
        </template>

        <template #right-action>
          <Trash2Icon />
        </template>

        <p class="px-4 py-3 text-sm">{{ item }}</p>
      </SwipeAction>
    </ul>
  </div>
</template>
