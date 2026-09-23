<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { DialogClose } from 'reka-ui';
import { cn } from '@/utils';
import { Button } from '../button';

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'];
  showCloseButton?: boolean;
}>(), {
  showCloseButton: false,
});
</script>

<template>
  <div
    data-slot="dialog-footer"
    :class="cn('-mx-6 flex flex-col-reverse gap-4 border-t border-border px-6 py-4 sm:flex-row sm:justify-end [[data-slot=dialog-header]+&]:border-t-0', props.class)"
  >
    <slot />
    <DialogClose v-if="showCloseButton" as-child>
      <Button variant="outline">
        Close
      </Button>
    </DialogClose>
  </div>
</template>
