import { ref } from 'vue';

export interface ConfirmOptions {
  message: string;
  acceptButtonText: string;
  accept: () => void;
  reject?: () => void;
  title?: string;
  cancelButtonText?: string;
}

const confirmState = ref<ConfirmOptions | null>(null);

export function useConfirmState() {
  return confirmState;
}

export function useConfirm() {
  function require(options: ConfirmOptions) {
    confirmState.value = options;
  }

  return { require };
}
