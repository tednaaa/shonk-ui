<script setup lang="ts">
import { Textarea } from 'shonk-ui';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
	<Textarea v-model="value" auto-resize placeholder="Grows as you type, then scrolls." />
</template>
