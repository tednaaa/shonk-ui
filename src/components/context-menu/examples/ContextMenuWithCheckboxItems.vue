<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from 'shonk-ui';
import { ref } from 'vue';

const showStatusBar = ref(true);
const showActivityBar = ref(false);
const showPanel = ref(false);
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="border-border text-muted-foreground flex h-37.5 w-75 items-center justify-center rounded-md border border-dashed text-sm select-none">
      Right click here
    </ContextMenuTrigger>

    <ContextMenuContent class="w-64">
      <ContextMenuLabel>Appearance</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem v-model="showStatusBar">Status Bar</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem v-model="showActivityBar">Activity Bar</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem v-model="showPanel">Panel</ContextMenuCheckboxItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
