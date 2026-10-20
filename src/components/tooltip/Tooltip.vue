<script setup lang="ts">
import type { TooltipContentProps, TooltipRootEmits, TooltipRootProps } from 'reka-ui';
import type { FunctionalComponent, HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { injectTooltipProviderContext, TooltipRoot, useForwardPropsEmits } from 'reka-ui';
import TooltipContent from './TooltipContent.vue';
import TooltipProvider from './TooltipProvider.vue';
import TooltipTrigger from './TooltipTrigger.vue';

const props = defineProps<TooltipRootProps & {
	content?: string;
	side?: TooltipContentProps['side'];
	contentClass?: HTMLAttributes['class'];
}>();
const emits = defineEmits<TooltipRootEmits>();

const delegatedProps = reactiveOmit(props, 'content', 'side', 'contentClass');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.();
const wrapper = injectTooltipProviderContext(null) ? Passthrough : TooltipProvider;
</script>

<template>
	<component :is="wrapper">
		<TooltipRoot
			#default="slotProps"
			data-slot="tooltip"
			v-bind="forwarded"
		>
			<template v-if="props.content !== undefined || $slots.content">
				<TooltipTrigger as-child>
					<slot v-bind="slotProps" />
				</TooltipTrigger>
				<TooltipContent :side="props.side" :class="props.contentClass">
					<slot name="content">
						{{ props.content }}
					</slot>
				</TooltipContent>
			</template>
			<slot v-else v-bind="slotProps" />
		</TooltipRoot>
	</component>
</template>
