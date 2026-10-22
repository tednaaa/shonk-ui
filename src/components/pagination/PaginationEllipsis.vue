<script setup lang="ts">
import type { PaginationEllipsisProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { MoreHorizontal } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationEllipsis } from 'reka-ui';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<PaginationEllipsisProps & {
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['pagination']>;
}>();

const locale = useLocale(() => ({ pagination: props.locale }));

const delegatedProps = reactiveOmit(props, 'class', 'locale');
</script>

<template>
	<PaginationEllipsis
		data-slot="pagination-ellipsis"
		v-bind="delegatedProps"
		:class="cn('flex size-9 items-center justify-center text-muted-foreground', props.class)"
	>
		<slot>
			<MoreHorizontal class="size-4" />
			<span class="sr-only">{{ locale.pagination.ellipsisScreenReaderText }}</span>
		</slot>
	</PaginationEllipsis>
</template>
