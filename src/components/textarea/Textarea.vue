<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';
import { textareaVariants } from './variants';

const props = defineProps<{
	autoResize?: boolean;
	class?: HTMLAttributes['class'];
}>();

const modelValue = defineModel<string | number>({ required: true });
</script>

<template>
	<textarea
		v-model="modelValue"
		data-slot="textarea"
		:class="cn(textareaVariants({ autoResize }), props.class)"
	/>
</template>
