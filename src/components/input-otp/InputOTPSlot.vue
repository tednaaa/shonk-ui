<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { useVueOTPContext } from 'vue-input-otp';
import { cn } from '@/utils';

const props = defineProps<{
  index: number;
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}>();

const context = useVueOTPContext();

const slot = computed(() => context?.value.slots[props.index]);
</script>

<template>
  <div
    data-slot="input-otp-slot"
    :data-active="slot?.isActive"
    :aria-invalid="props.invalid || undefined"
    :class="cn(
      'relative flex size-10 items-center justify-center border-y border-r border-border bg-background text-sm text-foreground shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md dark:bg-input/30',
      'data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50',
      'aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40',
      props.class,
    )"
  >
    {{ slot?.char }}

    <div v-if="slot?.hasFakeCaret" class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div class="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
    </div>
  </div>
</template>
