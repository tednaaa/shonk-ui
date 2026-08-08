<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import type { AlertAppearance, AlertVariant } from './variants';
import { CheckCircle2Icon, CircleAlertIcon, TriangleAlertIcon } from '@lucide/vue';
import { computed, useSlots } from 'vue';
import { cn, hasSlotContent } from '@/utils';
import { alertVariants } from '.';

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class'];
  variant?: AlertVariant;
  appearance?: AlertAppearance;
  title?: string;
}>(), {
  variant: 'default',
  appearance: 'default',
});

const icons: Record<AlertVariant, Component | null> = {
  default: null,
  warning: TriangleAlertIcon,
  destructive: CircleAlertIcon,
  success: CheckCircle2Icon,
};

const icon = computed(() => icons[props.variant]);

const slots = useSlots();
const hasDefaultContent = computed(() => hasSlotContent(slots.default));
</script>

<template>
  <div
    data-slot="alert"
    :class="cn(alertVariants({ variant, appearance }), props.class)"
    role="alert"
  >
    <div v-if="props.title" class="flex items-center gap-2">
      <component :is="icon" v-if="icon" class="size-5" />

      <h4 v-if="props.title" class="font-semibold text-base">{{ props.title }}</h4>
      <slot v-else-if="$slots.title" name="title" />
    </div>

    <div v-if="hasDefaultContent" class="text-current/90">
      <slot />
    </div>
  </div>
</template>
