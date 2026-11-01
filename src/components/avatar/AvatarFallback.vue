<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AvatarFallback } from 'reka-ui';
import { computed } from 'vue';
import { cn } from '@/utils';
import { nameInitials, nameTone } from './initials';
import { avatarFallbackVariants } from './variants';

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class']; name?: string }>();

const delegatedProps = reactiveOmit(props, 'class', 'name');

const initials = computed(() => (props.name ? nameInitials(props.name) : ''));
const tone = computed(() => (props.name ? nameTone(props.name) : 'none'));
</script>

<template>
	<AvatarFallback
		data-slot="avatar-fallback"
		v-bind="delegatedProps"
		:class="cn(avatarFallbackVariants({ tone }), props.class)"
	>
		<slot>
			<span v-if="name" class="text-[40cqw] leading-none font-semibold">{{ initials }}</span>
		</slot>
	</AvatarFallback>
</template>
