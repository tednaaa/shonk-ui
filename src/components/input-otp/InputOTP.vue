<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { MinusIcon } from '@lucide/vue';
import { computed, nextTick, useTemplateRef } from 'vue';
import { cn } from '@/utils';

export interface InputOTPProps {
  length?: number;
  groupSize?: number;
  pattern?: string | RegExp;
  pasteTransformer?: (pasted: string) => string;
  defaultValue?: string;
  placeholder?: string;
  inputmode?: 'numeric' | 'text';
  name?: string;
  required?: boolean;
  disabled?: boolean;
  mask?: boolean;
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<InputOTPProps>(), {
  length: 6,
  inputmode: 'numeric',
});

const emit = defineEmits<{ complete: [value: string] }>();

defineSlots<{
  separator?: () => unknown;
}>();

const modelValue = defineModel<string>({
  default: (rawProps: InputOTPProps) => rawProps.defaultValue ?? '',
});

const container = useTemplateRef<HTMLElement>('container');

const characters = computed(() => Array.from({ length: props.length }, (_, index) => modelValue.value[index] ?? ''));

const groups = computed(() => {
  const size = props.groupSize && props.groupSize > 0 ? props.groupSize : props.length;
  const indexes = characters.value.map((_, index) => index);

  return Array.from(
    { length: Math.ceil(indexes.length / size) },
    (_, group) => indexes.slice(group * size, group * size + size),
  );
});

const compiledPattern = computed(() => props.pattern ? new RegExp(props.pattern) : null);

function focusBox(index: number) {
  nextTick(() => {
    const box = container.value?.querySelectorAll<HTMLInputElement>('[data-slot="input-otp-slot"]')[index];

    box?.focus();
    box?.select();
  });
}

function valueWith(index: number, text: string) {
  const next = characters.value.slice();

  Array.from(text).forEach((character, offset) => {
    next[index + offset] = character;
  });

  return next.slice(0, props.length).join('');
}

function valueWithout(index: number) {
  const next = characters.value.slice();

  next[index] = '';

  return next.join('');
}

function commit(value: string) {
  if (value && compiledPattern.value && !compiledPattern.value.test(value))
    return false;

  const wasComplete = modelValue.value.length === props.length;

  modelValue.value = value;

  if (!wasComplete && value.length === props.length)
    emit('complete', value);

  return true;
}

function handleInput(event: Event, index: number) {
  const box = event.target as HTMLInputElement;
  const previous = characters.value[index];
  const typed = previous && box.value.startsWith(previous) ? box.value.slice(previous.length) : box.value;

  box.value = previous;

  const accepted = commit(typed ? valueWith(index, typed) : valueWithout(index));
  const next = Math.min(index + Array.from(typed).length, modelValue.value.length, props.length - 1);

  focusBox(accepted ? next : index);
}

function handlePaste(event: ClipboardEvent, index: number) {
  event.preventDefault();

  const pasted = event.clipboardData?.getData('text') ?? '';
  const text = props.pasteTransformer ? props.pasteTransformer(pasted) : pasted;

  if (!text || !commit(valueWith(index, text)))
    return;

  focusBox(Math.min(modelValue.value.length, props.length - 1));
}

function handleFocus(event: FocusEvent, index: number) {
  const reachable = Math.min(index, modelValue.value.length, props.length - 1);

  if (reachable === index) {
    (event.target as HTMLInputElement).select();

    return;
  }

  focusBox(reachable);
}

const keyHandlers: Record<string, (index: number) => void> = {
  Backspace: (index) => {
    const target = characters.value[index] ? index : index - 1;

    if (target < 0)
      return;

    commit(valueWithout(target));
    focusBox(target);
  },
  Delete: (index) => {
    commit(valueWithout(index));
    focusBox(index);
  },
  ArrowLeft: index => focusBox(index - 1),
  ArrowRight: index => focusBox(index + 1),
  Home: () => focusBox(0),
  End: () => focusBox(props.length - 1),
};

function handleKeydown(event: KeyboardEvent, index: number) {
  const handler = keyHandlers[event.key];

  if (!handler)
    return;

  event.preventDefault();
  handler(index);
}
</script>

<template>
  <div
    ref="container"
    role="group"
    data-slot="input-otp"
    :class="cn('flex w-fit items-center gap-2 has-disabled:opacity-50', props.class)"
  >
    <template v-for="(group, groupIndex) in groups" :key="groupIndex">
      <div
        v-if="groupIndex > 0"
        role="separator"
        data-slot="input-otp-separator"
        class="flex items-center text-muted-foreground [&_svg:not([class*=size-])]:size-4"
      >
        <slot name="separator">
          <MinusIcon />
        </slot>
      </div>

      <div data-slot="input-otp-group" class="flex items-center">
        <input
          v-for="index in group"
          :key="index"
          data-slot="input-otp-slot"
          autocomplete="one-time-code"
          autocorrect="off"
          spellcheck="false"
          :value="characters[index]"
          :type="mask ? 'password' : 'text'"
          :inputmode="inputmode"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :aria-invalid="invalid || undefined"
          :class="cn(
            'relative size-10 border-y border-r border-border bg-field text-center text-sm text-field-foreground shadow-xs transition-all outline-none placeholder:text-muted-foreground first:rounded-l-md first:border-l last:rounded-r-md disabled:cursor-not-allowed',
            'focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'aria-invalid:border-destructive focus-visible:aria-invalid:ring-destructive-ring',
          )"
          @input="handleInput($event, index)"
          @keydown="handleKeydown($event, index)"
          @focus="handleFocus($event, index)"
          @paste="handlePaste($event, index)"
        >
      </div>
    </template>

    <input v-if="name" type="hidden" :name="name" :value="modelValue">
  </div>
</template>
