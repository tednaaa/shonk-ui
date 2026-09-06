<script setup lang="ts">
import { RangeDatePicker } from 'shonk-ui';
import { ref } from 'vue';

const dates = ref([new Date(2026, 5, 1), new Date(2026, 5, 15)]);
</script>

<template>
  <RangeDatePicker v-model="dates" trigger-placeholder="Pick a date range" />
</template>
