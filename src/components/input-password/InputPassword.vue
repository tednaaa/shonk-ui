<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Eye, EyeOff } from '@lucide/vue';
import { computed, ref } from 'vue';
import { cn } from '@/utils';
import { Button } from '../button';
import { Input } from '../input';

const props = defineProps<{
  name: string;
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}>();

const modelValue = defineModel<string>();

const visible = ref(false);

const inputType = computed(() => visible.value ? 'text' : 'password');
const buttonAriaLabel = computed(() => visible.value ? 'Hide password' : 'Show password');
</script>

<template>
  <div data-slot="input-password" :class="cn('relative', props.class)">
    <Input
      v-model="modelValue"
      class="pr-10"
      :type="inputType"
      :name="name"
      :aria-invalid="invalid || undefined"
    />
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      class="absolute right-1 top-1/2 -translate-y-1/2 text-text-tertiary"
      :aria-label="buttonAriaLabel"
      @click="visible = !visible"
    >
      <EyeOff v-if="visible" />
      <Eye v-else />
    </Button>
  </div>
</template>
