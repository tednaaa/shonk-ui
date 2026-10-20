<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<div
		data-slot="number-field-content"
		:class="cn('relative *:data-[slot=number-field-input]:has-data-[slot=number-field-decrement]:pl-10 *:data-[slot=number-field-input]:has-data-[slot=number-field-increment]:pr-10', props.class)"
	>
		<slot />
	</div>
</template>
