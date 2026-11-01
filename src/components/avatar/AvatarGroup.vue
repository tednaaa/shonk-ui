<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';
import { avatarGroupVariants } from './variants';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	interactive?: boolean;
}>();
</script>

<template>
	<div
		data-slot="avatar-group"
		:class="cn(avatarGroupVariants({ interactive }), props.class)"
	>
		<slot />
	</div>
</template>
