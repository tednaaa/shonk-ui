<script setup lang="ts">
import { Button, ConfirmDialog, useConfirm } from 'shonk-ui';
import { ref } from 'vue';

const { require } = useConfirm();
const result = ref('');

function askToInvite() {
  require({
    message: 'The invitation will be sent to every member of the team.',
    acceptButtonText: 'Send invitations',
    accept: () => (result.value = 'Invitations sent'),
    reject: () => (result.value = 'Cancelled'),
  });
}

function askToDelete() {
  require({
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    acceptButtonText: 'Delete',
    acceptButtonVariant: 'destructive',
    accept: () => (result.value = 'Deleted'),
    reject: () => (result.value = 'Cancelled'),
  });
}
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <div class="flex gap-2">
      <Button variant="secondary" @click="askToInvite">Invite team</Button>
      <Button variant="secondary" @click="askToDelete">Delete item</Button>
    </div>
    <p v-if="result" class="text-sm text-muted-foreground">Result: {{ result }}</p>
    <ConfirmDialog />
  </div>
</template>
