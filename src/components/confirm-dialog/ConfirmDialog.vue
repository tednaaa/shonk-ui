<script setup lang="ts">
import { computed } from 'vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../alert-dialog';
import { buttonVariants } from '../button';
import { useConfirmState } from './useConfirm';

const state = useConfirmState();
const open = computed(() => state.value !== null);

// DialogClose (which AlertDialogAction wraps) calls onOpenChange(false) via mergeProps,
// so handleOpenChange fires before our @click handler and nulls state first.
// Snapshot state here while it's still set so the click handlers can call the callbacks.
let snapshot = state.value;

function handleAccept() {
  const options = snapshot;
  snapshot = null;
  options?.accept();
}

function handleReject() {
  const options = snapshot;
  snapshot = null;
  options?.reject?.();
}

function handleOpenChange(isOpen: boolean) {
  if (!isOpen) {
    snapshot = state.value;
    state.value = null;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent class="p-0 gap-0 sm:max-w-lg">
      <AlertDialogHeader class="py-4 px-6 bg-bg-muted border-b border-b-border-default rounded-t-lg text-left gap-0">
        <AlertDialogTitle class="text-sm leading-none font-extrabold">
          Потверждение
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription class="px-6 py-4 border-b border-border-default">
        {{ state?.message }}
      </AlertDialogDescription>
      <AlertDialogFooter class="mx-6 my-4">
        <AlertDialogCancel @click="handleReject">
          Отменить
        </AlertDialogCancel>
        <AlertDialogAction :class="buttonVariants({ variant: 'destructive' })" @click="handleAccept">
          {{ state?.acceptLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
