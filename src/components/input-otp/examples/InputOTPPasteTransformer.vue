<script setup lang="ts">
import { InputOTP, REGEXP_ONLY_DIGITS } from 'shonk-ui';
import { ref } from 'vue';

const code = ref('');

function digitsOnly(pasted: string) {
  return pasted.replace(/\D/g, '');
}
</script>

<template>
  <InputOTP
    v-model="code"
    :group-size="3"
    :pattern="REGEXP_ONLY_DIGITS"
    :paste-transformer="digitsOnly"
  />
</template>
