<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { reactiveOmit } from '@vueuse/core';
import { PaginationRoot, useForwardPropsEmits } from 'reka-ui';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<PaginationRootProps & {
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['pagination']>;
}>();
const emits = defineEmits<PaginationRootEmits>();

const locale = useLocale(() => ({ pagination: props.locale }));

const delegatedProps = reactiveOmit(props, 'class', 'locale');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<PaginationRoot
		#default="slotProps"
		data-slot="pagination"
		v-bind="forwarded"
		:aria-label="locale.pagination.navAriaLabel"
		:class="cn('mx-auto flex w-full justify-center', props.class)"
	>
		<slot v-bind="slotProps" />
	</PaginationRoot>
</template>
