<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { CodeBlockVariants } from './variants';
import type { ShonkLocale } from '@/locales';
import { provideLocale } from '@/locales';
import { cn } from '@/utils';
import { codeBlockVariants } from './variants';

const props = withDefaults(defineProps<{
	variant?: CodeBlockVariants['variant'];
	size?: 'default' | 'sm';
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['codeBlock']>;
}>(), {
	variant: 'default',
	size: 'default',
});

provideLocale(() => ({ codeBlock: props.locale }));
</script>

<template>
	<div
		data-slot="code-block"
		:data-variant="variant"
		:data-size="size"
		:class="cn(codeBlockVariants({ variant }), props.class)"
	>
		<slot />
	</div>
</template>
