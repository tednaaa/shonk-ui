<script setup lang="ts">
import { Textarea } from 'shonk-ui';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
  <Textarea v-model="value" placeholder="This field is disabled." disabled />
</template>
