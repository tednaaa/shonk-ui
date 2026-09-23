<script setup lang="ts">
import type { SelectContentEmits, SelectContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import {
  SelectContent,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from 'reka-ui';
import { cn } from '@/utils';
import SelectScrollDownButton from './SelectScrollDownButton.vue';
import SelectScrollUpButton from './SelectScrollUpButton.vue';
import { selectContentVariants, selectViewportVariants } from './variants';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    position: 'popper',
  },
);
const emits = defineEmits<SelectContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SelectPortal>
    <SelectContent
      data-slot="select-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="cn(selectContentVariants({ position }), props.class)"
    >
      <SelectScrollUpButton />
      <SelectViewport :class="selectViewportVariants({ position })">
        <slot />
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContent>
  </SelectPortal>
</template>
