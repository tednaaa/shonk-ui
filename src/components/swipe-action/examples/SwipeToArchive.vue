<script setup lang="ts">
import { ArchiveIcon } from '@lucide/vue';
import { SwipeAction } from 'shonk-ui';
import { ref } from 'vue';

const items = ref(['Buy milk', 'Call the dentist', 'Renew passport']);

function archive(index: number) {
  items.value.splice(index, 1);
}
</script>

<template>
  <ul class="overflow-hidden rounded-md border border-border">
    <SwipeAction
      v-for="(item, index) in items"
      :key="item"
      as="li"
      left-action-aria-label="Archive"
      left-action-class="bg-secondary text-secondary-foreground"
      class="border-b border-border last:border-b-0"
      @trigger="archive(index)"
    >
      <template #left-action>
        <ArchiveIcon />
      </template>

      <p class="px-4 py-3 text-sm">{{ item }}</p>
    </SwipeAction>
  </ul>
</template>
