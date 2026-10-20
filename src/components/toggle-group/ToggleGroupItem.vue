<script setup lang="ts">
import type { ToggleGroupItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '../button';
import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupItem, useForwardProps } from 'reka-ui';
import { computed, inject } from 'vue';
import { cn } from '@/utils';
import { buttonVariants } from '../button';
import { toggleGroupKey } from './context';

const props = defineProps<ToggleGroupItemProps & {
	class?: HTMLAttributes['class'];
	variant?: ButtonVariants['variant'];
	size?: ButtonVariants['size'];
}>();

const context = inject(toggleGroupKey, undefined);

const variant = computed(() => context?.value.variant ?? props.variant ?? 'ghost');
const size = computed(() => context?.value.size ?? props.size);
const spacing = computed(() => context?.value.spacing);

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
	<ToggleGroupItem
		#default="slotProps"
		data-slot="toggle-group-item"
		:data-variant="variant"
		:data-size="size"
		:data-spacing="spacing"
		v-bind="forwardedProps"
		:class="cn(
			buttonVariants({ variant, size, pressable: true }),
			'shrink-0 focus:z-10 focus-visible:z-10',
			'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=secondary]:border-l-0 data-[spacing=0]:data-[variant=secondary]:first:border-l',
			props.class,
		)"
	>
		<slot v-bind="slotProps" />
	</ToggleGroupItem>
</template>
