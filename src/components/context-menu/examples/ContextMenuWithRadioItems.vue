<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from 'shonk-ui';
import { ref } from 'vue';

const position = ref('bottom');
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="border-border text-muted-foreground flex h-37.5 w-75 items-center justify-center rounded-md border border-dashed text-sm select-none">
      Right click here
    </ContextMenuTrigger>

    <ContextMenuContent class="w-64">
      <ContextMenuLabel>Panel Position</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup v-model="position">
        <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
        <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
        <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
