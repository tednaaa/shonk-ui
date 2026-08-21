<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import { useForwardPropsEmits } from 'reka-ui';
import { useLocale } from '@/locales';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../dialog';
import Command from './Command.vue';

const props = defineProps<DialogRootProps & {
  screenReaderTitle?: string;
  screenReaderDescription?: string;
}>();
const emits = defineEmits<DialogRootEmits>();

const locale = useLocale();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <Dialog #default="slotProps" v-bind="forwarded">
    <DialogContent class="overflow-hidden p-0 ">
      <DialogHeader class="sr-only">
        <DialogTitle>{{ props.screenReaderTitle ?? locale.command.screenReaderTitle }}</DialogTitle>
        <DialogDescription>{{ props.screenReaderDescription ?? locale.command.screenReaderDescription }}</DialogDescription>
      </DialogHeader>
      <Command>
        <slot v-bind="slotProps" />
      </Command>
    </DialogContent>
  </Dialog>
</template>
