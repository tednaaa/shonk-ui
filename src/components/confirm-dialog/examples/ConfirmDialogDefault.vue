<script setup lang="ts">
import { Button, ConfirmDialog, useConfirm } from 'shonk-ui';
import { ref } from 'vue';

const { require } = useConfirm();
const result = ref('');

function confirm() {
  require({
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    acceptButtonText: 'Delete',
    accept: () => (result.value = 'Accepted'),
    reject: () => (result.value = 'Rejected'),
  });
}
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Button variant="outline" @click="confirm">Delete item</Button>
    <p v-if="result" class="text-muted-foreground text-sm">Result: {{ result }}</p>
    <ConfirmDialog />
  </div>
</template>
