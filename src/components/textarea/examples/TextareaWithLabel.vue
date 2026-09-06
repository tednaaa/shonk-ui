<script setup lang="ts">
import { Label, Textarea } from 'shonk-ui';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
  <div class="grid gap-2">
    <Label for="message">Your message</Label>
    <Textarea id="message" v-model="value" placeholder="Type your message here." />
  </div>
</template>
