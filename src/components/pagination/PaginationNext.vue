<script setup lang="ts">
import type { PaginationNextProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import type { ShonkLocale } from '@/locales';
import { ChevronRightIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationNext, useForwardProps } from 'reka-ui';
import { computed } from 'vue';
import { buttonVariants } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationNextProps & {
	size?: ButtonVariants['size'];
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['pagination']>;
}>(), {
	size: 'default',
});

const locale = useLocale(() => ({ pagination: props.locale }));

const resolvedButtonText = computed(() => locale.value.pagination.nextButtonText);

const delegatedProps = reactiveOmit(props, 'class', 'size', 'locale');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
	<PaginationNext
		data-slot="pagination-next"
		:class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 px-2.5 sm:pr-2.5', props.class)"
		v-bind="forwarded"
		:aria-label="resolvedButtonText"
	>
		<slot>
			<span class="hidden sm:block">{{ resolvedButtonText }}</span>
			<ChevronRightIcon />
		</slot>
	</PaginationNext>
</template>
