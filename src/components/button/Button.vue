<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '.';
import { LoaderCircleIcon } from '@lucide/vue';
import { Primitive } from 'reka-ui';
import { cn } from '@/utils';
import { buttonVariants } from '.';

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :disabled="loading || disabled"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <LoaderCircleIcon v-if="loading" class="animate-spin" />
    <slot />
  </Primitive>
</template>
