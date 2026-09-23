<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { Progress } from 'shonk-ui';
import { ref } from 'vue';

const value = ref(0);

useIntervalFn(() => {
  value.value = value.value === 100 ? 0 : Math.min(value.value + 20, 100);
}, 800);
</script>

<template>
  <Progress :model-value="value" />
</template>
