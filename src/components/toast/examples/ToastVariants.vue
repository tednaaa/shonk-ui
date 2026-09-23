<script setup lang="ts">
import { Button, toast, Toaster } from 'shonk-ui';
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button variant="secondary" @click="toast.success('Changes saved successfully.')">Success</Button>
    <Button variant="secondary" @click="toast.error('Something went wrong.')">Error</Button>
    <Button variant="secondary" @click="toast.warning('Your trial ends in 3 days.')">Warning</Button>
    <Button variant="secondary" @click="toast.info('A new version is available.')">Info</Button>
  </div>

  <Toaster />
</template>
