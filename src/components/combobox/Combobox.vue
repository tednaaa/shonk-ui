<script setup lang="ts" generic="T extends AcceptableValue = AcceptableValue">
import type { AcceptableValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ComboboxOption } from './types';
import { CheckIcon, ChevronDownIcon, XIcon } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Spinner } from '../spinner';

const props = defineProps<{
  options: ComboboxOption<T>[];
  triggerPlaceholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
  clearButtonAriaLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  manualFilter?: boolean;
  class?: HTMLAttributes['class'];
  contentClass?: HTMLAttributes['class'];
}>();

defineSlots<{
  option?: (props: { option: ComboboxOption<T> }) => unknown;
  empty?: () => unknown;
}>();

const model = defineModel<T>();
const search = defineModel<string>('search', { default: '' });

const locale = useLocale();

const open = ref(false);

const lastSelectedLabel = ref<string>();

watch(
  [model, () => props.options],
  ([value]) => {
    const selectedOption = props.options.find(option => option.value === value);
    const cleared = value === undefined || value === null;

    if (selectedOption)
      lastSelectedLabel.value = selectedOption.label;
    else if (cleared)
      lastSelectedLabel.value = undefined;
  },
  { immediate: true },
);

const showClear = computed(() => props.clearable && !!lastSelectedLabel.value && !props.disabled);

function onUpdate() {
  open.value = false;
}

function clear() {
  model.value = undefined;
  lastSelectedLabel.value = undefined;
  search.value = '';
}
</script>

<template>
  <Popover v-model:open="open">
    <div class="relative w-full">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          :disabled="disabled"
          :class="cn('w-full justify-start font-normal', showClear ? 'pr-14' : 'pr-9', !lastSelectedLabel && 'text-text-tertiary', props.class)"
        >
          <span class="whitespace-nowrap">{{ lastSelectedLabel ?? props.triggerPlaceholder ?? locale.combobox.triggerPlaceholder }}</span>
        </Button>
      </PopoverTrigger>

      <div class="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
        <button
          v-if="showClear"
          type="button"
          :aria-label="props.clearButtonAriaLabel ?? locale.combobox.clearButtonAriaLabel"
          tabindex="-1"
          class="text-text-tertiary hover:text-text-primary focus-visible:ring-border-focus/50 pointer-events-auto cursor-pointer rounded-xs outline-none transition-colors focus-visible:ring-[3px]"
          @pointerdown.stop.prevent="clear"
        >
          <XIcon class="size-4" />
        </button>
        <ChevronDownIcon class="size-4 opacity-50" />
      </div>
    </div>

    <PopoverContent align="start" :class="cn('p-0', contentClass)">
      <Command
        v-model="model"
        :manual-filter
        @update:model-value="onUpdate"
      >
        <CommandInput
          :placeholder="props.searchPlaceholder ?? locale.combobox.searchPlaceholder"
          @update:model-value="(v: string) => (search = v)"
        />
        <CommandList>
          <div
            v-if="loading"
            class="text-text-tertiary flex items-center justify-center gap-2 py-6 text-sm"
          >
            <Spinner />
            <span>{{ props.loadingText ?? locale.combobox.loadingText }}</span>
          </div>
          <template v-else>
            <CommandEmpty>
              <slot name="empty">
                {{ props.emptyText ?? locale.combobox.emptyText }}
              </slot>
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                <CheckIcon :class="cn('size-4', model === option.value ? 'opacity-100' : 'opacity-0')" />
                <slot
                  name="option"
                  :option="option"
                >
                  {{ option.label }}
                </slot>
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
