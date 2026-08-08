import type { ExternalToast } from 'vue-sonner';
import { toast as sonner } from 'vue-sonner';

type PromiseParams = Parameters<typeof sonner.promise>;

const DEFAULT_OPTIONS: ExternalToast = {
  duration: 5000,
  position: 'top-right',
} as const;

function withDefaults(options?: ExternalToast): ExternalToast {
  return { ...DEFAULT_OPTIONS, ...options };
}

export function toast(title: string, options?: ExternalToast) {
  sonner(title, withDefaults(options));
}

toast.success = (title: string, options?: ExternalToast) => sonner.success(title, withDefaults(options));
toast.error = (title: string, options?: ExternalToast) => sonner.error(title, withDefaults(options));
toast.warning = (title: string, options?: ExternalToast) => sonner.warning(title, withDefaults(options));
toast.info = (title: string, options?: ExternalToast) => sonner.info(title, withDefaults(options));
toast.promise = (promise: PromiseParams[0], options?: PromiseParams[1]) => sonner.promise(promise, { ...DEFAULT_OPTIONS, ...options });
toast.dismiss = sonner.dismiss;
