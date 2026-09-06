<script setup lang="ts">
import { Button, toast, Toaster } from 'shonk-ui';

function show() {
  const promise = new Promise(resolve => setTimeout(resolve, 2000));

  toast.promise(promise, {
    loading: 'Saving…',
    success: 'Settings saved',
    error: 'Could not save settings',
  });
}
</script>

<template>
  <Button variant="outline" @click="show">Run promise</Button>
  <Toaster />
</template>
