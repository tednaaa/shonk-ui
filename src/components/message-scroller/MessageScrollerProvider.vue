<script setup lang="ts">
import type { MessageScrollerProviderProps } from './composables/useMessageScroller';
import { provideMessageScroller } from './composables/useMessageScroller';

const props = defineProps<MessageScrollerProviderProps>();

provideMessageScroller(props);
</script>

<template>
	<slot />
</template>
