<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { XIcon } from '@lucide/vue';
import { DialogClose } from 'reka-ui';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'];
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
}>(), {
  showCloseButton: true,
});

const locale = useLocale();
</script>

<template>
  <div
    data-slot="dialog-header"
    :class="cn('border-border-default -mx-6 flex items-center justify-between gap-4 border-b px-6 pt-5 pb-4', props.class)"
  >
    <div class="flex flex-col gap-1.5 text-left">
      <slot />
    </div>
    <DialogClose v-if="showCloseButton" as-child>
      <Button variant="ghost" size="icon-sm" :aria-label="props.closeButtonAriaLabel ?? locale.dialog.closeButtonAriaLabel" class="-mr-2 shrink-0">
        <XIcon class="size-5" />
      </Button>
    </DialogClose>
  </div>
</template>
