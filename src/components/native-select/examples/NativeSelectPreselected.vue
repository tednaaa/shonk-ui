<script setup lang="ts">
import { NativeSelect, NativeSelectOption } from 'shonk-ui';
import { ref } from 'vue';

const value = ref('banana');
</script>

<template>
  <NativeSelect v-model="value">
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    <NativeSelectOption value="grapes">Grapes</NativeSelectOption>
  </NativeSelect>
</template>
