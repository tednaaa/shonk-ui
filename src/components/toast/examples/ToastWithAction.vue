<script setup lang="ts">
import { Button, toast, Toaster } from 'shonk-ui';

function show() {
  toast('Event has been created', {
    description: 'Sunday, December 03, 2023 at 9:00 AM',
    action: {
      label: 'Undo',
      onClick: () => toast('Event removed'),
    },
  });
}
</script>

<template>
  <Button variant="outline" @click="show">Show toast with action</Button>
  <Toaster />
</template>
