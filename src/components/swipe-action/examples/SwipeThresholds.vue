<script setup lang="ts">
import { Trash2Icon } from '@lucide/vue';
import { SwipeAction } from 'shonk-ui';
import { ref } from 'vue';

const lists = ref([
  { title: 'Eager — deletes once a third of the row is gone', triggerThreshold: 0.3, items: ['Buy milk', 'Call the dentist', 'Renew passport'] },
  { title: 'Deliberate — holds out until the row is nearly away', triggerThreshold: 0.9, items: ['Buy milk', 'Call the dentist', 'Renew passport'] },
]);
</script>

<template>
  <div class="space-y-6">
    <div v-for="list in lists" :key="list.title" class="space-y-2">
      <p class="text-sm text-muted-foreground">{{ list.title }}</p>

      <ul class="overflow-hidden rounded-md border border-border">
        <SwipeAction
          v-for="(item, index) in list.items"
          :key="item"
          as="li"
          :trigger-threshold="list.triggerThreshold"
          right-action-aria-label="Delete"
          class="border-b border-border last:border-b-0"
          @trigger="list.items.splice(index, 1)"
        >
          <template #right-action>
            <Trash2Icon />
          </template>

          <p class="px-4 py-3 text-sm">{{ item }}</p>
        </SwipeAction>
      </ul>
    </div>
  </div>
</template>
