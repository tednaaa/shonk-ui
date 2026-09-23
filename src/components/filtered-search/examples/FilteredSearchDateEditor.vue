<script setup lang="ts">
import type { DateValue } from 'reka-ui';
import type { FilterOption } from 'shonk-ui';
import { Calendar } from 'shonk-ui';

const emit = defineEmits<{ submit: [option: FilterOption] }>();

function submit(value: DateValue | undefined) {
  if (value)
    emit('submit', { value: value.toString(), label: value.toString() });
}
</script>

<template>
  <Calendar class="p-2" @update:model-value="submit" />
</template>
