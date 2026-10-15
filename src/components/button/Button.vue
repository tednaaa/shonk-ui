<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'vue';
import type { ButtonVariants } from './variants';
import { LoaderCircleIcon } from '@lucide/vue';
import { Primitive } from 'reka-ui';
import { cn } from '@/utils';
import { buttonVariants } from './variants';

interface Props extends PrimitiveProps {
	variant?: ButtonVariants['variant'];
	size?: ButtonVariants['size'];
	class?: HTMLAttributes['class'];
	loading?: boolean;
	disabled?: boolean;
	type?: ButtonHTMLAttributes['type'];
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
	type: 'button',
});
</script>

<template>
	<Primitive
		data-slot="button"
		:data-variant="variant"
		:data-size="size"
		:as="as"
		:as-child="asChild"
		:type="as === 'button' && !asChild ? type : undefined"
		:disabled="loading || disabled"
		:class="cn(buttonVariants({ variant, size }), props.class)"
	>
		<LoaderCircleIcon v-if="loading" class="animate-spin" />
		<slot />
	</Primitive>
</template>
