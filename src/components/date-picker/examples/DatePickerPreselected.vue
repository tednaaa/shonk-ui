<script setup lang="ts">
import { DatePicker } from 'shonk-ui';
import { ref } from 'vue';

const date = ref(new Date(2026, 5, 15));
</script>

<template>
  <DatePicker v-model="date" trigger-placeholder="Pick a date" />
</template>
