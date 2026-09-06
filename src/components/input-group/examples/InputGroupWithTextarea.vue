<script setup lang="ts">
import { InfoIcon, PlusIcon, SendIcon } from '@lucide/vue';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from 'shonk-ui';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
  <InputGroup>
    <InputGroupTextarea v-model="value" placeholder="Ask, search, or chat…" />
    <InputGroupAddon align="block-end">
      <InputGroupButton size="icon-xs" aria-label="Add attachment"><PlusIcon /></InputGroupButton>
      <InputGroupText><InfoIcon />{{ value.length }} chars</InputGroupText>
      <InputGroupButton variant="default" size="sm" class="ml-auto">Send <SendIcon /></InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>
