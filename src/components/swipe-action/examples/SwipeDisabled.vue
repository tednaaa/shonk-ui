<script setup lang="ts">
import { Trash2Icon } from '@lucide/vue';
import { SwipeAction } from 'shonk-ui';

const items = ['Buy milk', 'Call the dentist', 'Renew passport'];
</script>

<template>
  <ul class="overflow-hidden rounded-md border border-border">
    <SwipeAction
      v-for="item in items"
      :key="item"
      as="li"
      disabled
      right-action-aria-label="Delete"
      class="border-b border-border last:border-b-0"
    >
      <template #right-action>
        <Trash2Icon />
      </template>

      <p class="px-4 py-3 text-sm">{{ item }}</p>
    </SwipeAction>
  </ul>
</template>
