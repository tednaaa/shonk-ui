<script setup lang="ts">
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ToggleVariants } from '../toggle';
import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupRoot, useForwardPropsEmits } from 'reka-ui';
import { computed, provide } from 'vue';
import { cn } from '@/utils';
import { toggleGroupKey } from './context';

const props = withDefaults(defineProps<ToggleGroupRootProps & {
	class?: HTMLAttributes['class'];
	variant?: ToggleVariants['variant'];
	size?: ToggleVariants['size'];
	spacing?: number;
}>(), {
	spacing: 0,
});

const emits = defineEmits<ToggleGroupRootEmits>();

provide(toggleGroupKey, computed(() => ({
	variant: props.variant,
	size: props.size,
	spacing: props.spacing,
})));

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant', 'spacing');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<ToggleGroupRoot
		#default="slotProps"
		data-slot="toggle-group"
		:data-size="size"
		:data-variant="variant"
		:data-spacing="spacing"
		:style="{ '--gap': spacing }"
		v-bind="forwarded"
		:class="cn('group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=0]:data-[variant=outline]:shadow-xs', props.class)"
	>
		<slot v-bind="slotProps" />
	</ToggleGroupRoot>
</template>
