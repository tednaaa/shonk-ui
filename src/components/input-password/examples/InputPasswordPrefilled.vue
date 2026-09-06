<script setup lang="ts">
import { InputPassword } from 'shonk-ui';
import { ref } from 'vue';

const password = ref('super-secret');
</script>

<template>
  <InputPassword v-model="password" name="password" />
</template>
