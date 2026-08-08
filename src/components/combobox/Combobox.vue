<script setup lang="ts" generic="T extends AcceptableValue = AcceptableValue">
import type { AcceptableValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ComboboxOption } from './types';
import { CheckIcon, ChevronDownIcon, XIcon } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
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

const props = withDefaults(
  defineProps<{
    options: ComboboxOption<T>[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    loadingText?: string;
    disabled?: boolean;
    /** Show a spinner in the list instead of results (e.g. while fetching). */
    loading?: boolean;
    /** Show an X button to reset the selection when a value is set. */
    clearable?: boolean;
    /**
     * Filter `options` yourself instead of letting Command match on label text.
     * Watch the `search` v-model, produce a filtered list (locally or from an
     * API), and feed it back through `options`.
     */
    manualFilter?: boolean;
    class?: HTMLAttributes['class'];
    contentClass?: HTMLAttributes['class'];
  }>(),
  {
    placeholder: 'Выбрать…',
    searchPlaceholder: 'Найти…',
    emptyText: 'Не найдено результатов.',
    loadingText: 'Загрузка…',
  },
);

defineSlots<{
  option?: (props: { option: ComboboxOption<T> }) => unknown;
  empty?: () => unknown;
}>();

const model = defineModel<T>();
const search = defineModel<string>('search', { default: '' });

const open = ref(false);

// Remember the selected label so the trigger keeps showing it even when the
// option list changes underneath it (e.g. async results are swapped in).
const selectedLabel = ref<string>();
watch(
  [model, () => props.options],
  ([value]) => {
    const found = props.options.find(o => o.value === value);
    if (found)
      selectedLabel.value = found.label;
    else if (value === undefined || value === null)
      selectedLabel.value = undefined;
  },
  { immediate: true },
);

const showClear = computed(() => props.clearable && !!selectedLabel.value && !props.disabled);

function onUpdate() {
  open.value = false;
}

function clear() {
  model.value = undefined;
  selectedLabel.value = undefined;
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
          :class="cn('w-full justify-start font-normal', showClear ? 'pr-14' : 'pr-9', !selectedLabel && 'text-text-tertiary', props.class)"
        >
          <span class="whitespace-nowrap">{{ selectedLabel ?? placeholder }}</span>
        </Button>
      </PopoverTrigger>

      <div class="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
        <button
          v-if="showClear"
          type="button"
          aria-label="Clear selection"
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
          :placeholder="searchPlaceholder"
          @update:model-value="(v: string) => (search = v)"
        />
        <CommandList>
          <div
            v-if="loading"
            class="text-text-tertiary flex items-center justify-center gap-2 py-6 text-sm"
          >
            <Spinner />
            <span>{{ loadingText }}</span>
          </div>
          <template v-else>
            <CommandEmpty>
              <slot name="empty">
                {{ emptyText }}
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
