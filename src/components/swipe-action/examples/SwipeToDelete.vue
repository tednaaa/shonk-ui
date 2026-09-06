<script setup lang="ts">
import { Trash2Icon } from '@lucide/vue';
import { SwipeAction } from 'shonk-ui';
import { ref } from 'vue';

const items = ref(['Buy milk', 'Call the dentist', 'Renew passport']);

function remove(index: number) {
  items.value.splice(index, 1);
}
</script>

<template>
  <ul class="overflow-hidden rounded-md border border-border">
    <SwipeAction
      v-for="(item, index) in items"
      :key="item"
      as="li"
      right-action-aria-label="Delete"
      class="border-b border-border last:border-b-0"
      @trigger="remove(index)"
    >
      <template #right-action>
        <Trash2Icon />
      </template>

      <p class="px-4 py-3 text-sm">{{ item }}</p>
    </SwipeAction>
  </ul>

  <p v-if="!items.length" class="text-sm text-muted-foreground">Nothing left.</p>
</template>
