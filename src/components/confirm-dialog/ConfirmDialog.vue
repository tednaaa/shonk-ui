<script setup lang="ts">
import type { ButtonVariants } from '../button';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { Button } from '../button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog';
import { useConfirmState } from './useConfirm';

const props = defineProps<{
  title?: string;
  cancelButtonText?: string;
  acceptButtonVariant?: ButtonVariants['variant'];
}>();

const locale = useLocale();

const state = useConfirmState();
const open = computed(() => state.value !== null);

const resolvedTitle = computed(() => state.value?.title ?? props.title ?? locale.value.confirmDialog.title);
const resolvedCancelButtonText = computed(() => state.value?.cancelButtonText ?? props.cancelButtonText ?? locale.value.confirmDialog.cancelButtonText);
const resolvedAcceptButtonVariant = computed(() => state.value?.acceptButtonVariant ?? props.acceptButtonVariant);

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

function preventDismiss(event: Event) {
  event.preventDefault();
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent
      role="alertdialog"
      @pointer-down-outside="preventDismiss"
      @interact-outside="preventDismiss"
    >
      <DialogHeader :show-close-button="false">
        <DialogTitle>
          {{ resolvedTitle }}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <DialogDescription>
          {{ state?.message }}
        </DialogDescription>
      </DialogBody>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary" @click="handleReject">
            {{ resolvedCancelButtonText }}
          </Button>
        </DialogClose>
        <DialogClose as-child>
          <Button :variant="resolvedAcceptButtonVariant" @click="handleAccept">
            {{ state?.acceptButtonText }}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
