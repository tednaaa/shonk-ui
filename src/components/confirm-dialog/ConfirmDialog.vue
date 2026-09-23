<script setup lang="ts">
import type { ButtonVariants } from '../button';
import { computed, ref, watch } from 'vue';
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

const shownRequest = ref(state.value);
let pendingRequest = state.value;

watch(state, (request) => {
  if (!request)
    return;

  shownRequest.value = request;
  pendingRequest = request;
});

const resolvedTitle = computed(() => shownRequest.value?.title ?? props.title ?? locale.value.confirmDialog.title);
const resolvedCancelButtonText = computed(() => shownRequest.value?.cancelButtonText ?? props.cancelButtonText ?? locale.value.confirmDialog.cancelButtonText);
const resolvedAcceptButtonVariant = computed(() => shownRequest.value?.acceptButtonVariant ?? props.acceptButtonVariant);

function takePendingRequest() {
  const request = pendingRequest;
  pendingRequest = null;

  return request;
}

function handleAccept() {
  takePendingRequest()?.accept();
}

function handleReject() {
  takePendingRequest()?.reject?.();
}

function handleOpenChange(isOpen: boolean) {
  if (!isOpen)
    state.value = null;
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
          {{ shownRequest?.message }}
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
            {{ shownRequest?.acceptButtonText }}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
