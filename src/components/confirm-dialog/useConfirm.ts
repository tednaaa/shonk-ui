import { ref } from 'vue';

interface ConfirmOptions {
  message: string;
  acceptLabel: string;
  accept: () => void;
  reject?: () => void;
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
