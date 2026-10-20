<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<span
		data-slot="trace-title"
		:class="cn('min-w-0 truncate motion-reduce:animate-none', props.class)"
	>
		<slot />
	</span>
</template>
