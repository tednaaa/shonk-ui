<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import { Primitive } from 'reka-ui';
import { useFileUploadContext } from './context';

const props = withDefaults(defineProps<PrimitiveProps>(), {
	as: 'button',
});

const context = useFileUploadContext();
</script>

<template>
	<Primitive
		data-slot="file-upload-trigger"
		:as="props.as"
		:as-child="props.asChild"
		:type="props.as === 'button' && !props.asChild ? 'button' : undefined"
		:disabled="context.disabled.value || undefined"
		@click="context.open"
	>
		<slot />
	</Primitive>
</template>
