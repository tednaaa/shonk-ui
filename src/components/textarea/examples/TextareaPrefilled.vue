<script setup lang="ts">
import { Textarea } from 'shonk-ui';
import { ref } from 'vue';

const value = ref('The quick brown fox jumps over the lazy dog.');
</script>

<template>
  <Textarea v-model="value" />
</template>
