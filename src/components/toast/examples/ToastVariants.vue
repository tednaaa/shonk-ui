<script setup lang="ts">
import { Button, toast, Toaster } from 'shonk-ui';
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button variant="outline" @click="toast.success('Changes saved successfully.')">Success</Button>
    <Button variant="outline" @click="toast.error('Something went wrong.')">Error</Button>
    <Button variant="outline" @click="toast.warning('Your trial ends in 3 days.')">Warning</Button>
    <Button variant="outline" @click="toast.info('A new version is available.')">Info</Button>
  </div>

  <Toaster />
</template>
