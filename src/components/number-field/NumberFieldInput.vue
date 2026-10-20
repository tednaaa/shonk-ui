<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { NumberFieldInput } from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<NumberFieldInput
		data-slot="number-field-input"
		:class="cn(
			'h-10 w-full min-w-0 rounded-md border border-border bg-field px-3 py-2.5 text-center text-base text-field-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			'focus-visible:border-ring',
			'aria-invalid:border-destructive aria-invalid:ring-destructive-ring',
			props.class,
		)"
	/>
</template>
