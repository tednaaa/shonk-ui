<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { CheckIcon, MinusIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/utils';
import { checkboxVariants } from './variants';

export interface CheckboxProps extends CheckboxRootProps {
	class?: HTMLAttributes['class'];
}

const props = defineProps<CheckboxProps>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<CheckboxRoot
		#default="slotProps"
		data-slot="checkbox"
		v-bind="forwarded"
		:class="cn(checkboxVariants(), props.class)"
	>
		<CheckboxIndicator
			force-mount
			data-slot="checkbox-indicator"
			class="grid place-content-center text-current transition-none data-[state=unchecked]:invisible"
		>
			<slot v-bind="slotProps">
				<MinusIcon v-if="slotProps.state === 'indeterminate'" class="size-3.5 text-current" />
				<CheckIcon v-else class="size-3.5 text-current" />
			</slot>
		</CheckboxIndicator>
	</CheckboxRoot>
</template>
