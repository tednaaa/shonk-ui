<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { MinusIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { NumberFieldDecrement, useForwardProps } from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
	<NumberFieldDecrement
		data-slot="number-field-decrement"
		v-bind="forwarded"
		:class="cn('absolute top-1/2 left-0 -translate-y-1/2 p-3 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-20', props.class)"
	>
		<slot>
			<MinusIcon class="size-4" />
		</slot>
	</NumberFieldDecrement>
</template>
