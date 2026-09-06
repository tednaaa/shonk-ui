<script setup lang="ts">
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shonk-ui';
import { ref } from 'vue';

const showStatusBar = ref(true);
const showActivityBar = ref(false);
const showPanel = ref(false);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">View options</Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56" align="start">
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem v-model="showStatusBar">Status Bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model="showActivityBar">Activity Bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model="showPanel">Panel</DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
