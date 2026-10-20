<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '../button';
import { Button } from '../button';

interface Props extends PrimitiveProps {
	class?: HTMLAttributes['class'];
	variant?: ButtonVariants['variant'];
	size?: ButtonVariants['size'];
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'ghost',
	size: 'icon-xs',
});
</script>

<template>
	<Button
		data-slot="attachment-action"
		:variant="variant"
		:size="size"
		:as="as"
		:as-child="asChild"
		:class="props.class"
	>
		<slot />
	</Button>
</template>
