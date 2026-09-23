<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { ChevronDown, X } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { injectSelectRootContext, SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui';
import { computed, useAttrs } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { selectTriggerIconVariants, selectTriggerVariants } from './variants';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectTriggerProps & {
  class?: HTMLAttributes['class'];
  size?: 'sm' | 'md';
  clearable?: boolean;
  clearButtonAriaLabel?: string;
}>(), {
  size: 'md',
});

const attrs = useAttrs();
const locale = useLocale();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'clearable', 'clearButtonAriaLabel');
const forwardedProps = useForwardProps(delegatedProps);

const rootContext = injectSelectRootContext();

const hasValue = computed(() => {
  const value = rootContext.modelValue?.value;
  return Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined;
});

const showClear = computed(
  () => props.clearable && hasValue.value && !rootContext.disabled?.value && !props.disabled,
);

function clear() {
  rootContext.modelValue.value = Array.isArray(rootContext.modelValue.value) ? [] : undefined;
}
</script>

<template>
  <div :class="cn('relative w-fit', props.class)">
    <SelectTrigger
      v-bind="{ ...attrs, ...forwardedProps }"
      data-slot="select-trigger"
      :data-size="size"
      :class="selectTriggerVariants({ size, showClear })"
    >
      <slot />
      <SelectIcon as-child>
        <ChevronDown :class="selectTriggerIconVariants({ showClear })" />
      </SelectIcon>
    </SelectTrigger>

    <button
      v-if="showClear"
      type="button"
      :aria-label="props.clearButtonAriaLabel ?? locale.select.clearButtonAriaLabel"
      tabindex="-1"
      class="absolute top-1/2 right-8 -translate-y-1/2 cursor-pointer rounded-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      @pointerdown.stop.prevent="clear"
    >
      <X class="size-4" />
    </button>
  </div>
</template>
