<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { X } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import SheetOverlay from './SheetOverlay.vue';
import { sheetContentVariants } from './variants';

interface SheetContentProps extends DialogContentProps {
  class?: HTMLAttributes['class'];
  side?: 'top' | 'right' | 'bottom' | 'left';
  closeButtonScreenReaderText?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SheetContentProps>(), {
  side: 'right',
});
const emits = defineEmits<DialogContentEmits>();

const locale = useLocale();

const delegatedProps = reactiveOmit(props, 'class', 'side', 'closeButtonScreenReaderText');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <SheetOverlay />
    <DialogContent
      data-slot="sheet-content"
      :class="cn(sheetContentVariants({ side }), props.class)"
      v-bind="{ ...$attrs, ...forwarded }"
    >
      <slot />

      <DialogClose
        class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <X class="size-4" />
        <span class="sr-only">{{ props.closeButtonScreenReaderText ?? locale.sheet.closeButtonScreenReaderText }}</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
