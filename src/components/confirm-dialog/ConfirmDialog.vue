<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '@/locales';
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

const props = defineProps<{
  title?: string;
  cancelButtonText?: string;
}>();

const locale = useLocale();

const state = useConfirmState();
const open = computed(() => state.value !== null);

const resolvedTitle = computed(() => state.value?.title ?? props.title ?? locale.value.confirmDialog.title);
const resolvedCancelButtonText = computed(() => state.value?.cancelButtonText ?? props.cancelButtonText ?? locale.value.confirmDialog.cancelButtonText);

let closingRequest = state.value;

function takeClosingRequest() {
  const request = closingRequest;
  closingRequest = null;

  return request;
}

function handleAccept() {
  takeClosingRequest()?.accept();
}

function handleReject() {
  takeClosingRequest()?.reject?.();
}

function handleOpenChange(isOpen: boolean) {
  if (!isOpen) {
    closingRequest = state.value;
    state.value = null;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent class="p-0 gap-0 sm:max-w-lg">
      <AlertDialogHeader class="py-4 px-6 bg-bg-muted border-b border-b-border-default rounded-t-lg text-left gap-0">
        <AlertDialogTitle class="text-sm leading-none font-extrabold">
          {{ resolvedTitle }}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription class="px-6 py-4 border-b border-border-default">
        {{ state?.message }}
      </AlertDialogDescription>
      <AlertDialogFooter class="mx-6 my-4">
        <AlertDialogCancel @click="handleReject">
          {{ resolvedCancelButtonText }}
        </AlertDialogCancel>
        <AlertDialogAction :class="buttonVariants({ variant: 'destructive' })" @click="handleAccept">
          {{ state?.acceptButtonText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
