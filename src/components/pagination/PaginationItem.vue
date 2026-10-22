<script setup lang="ts">
import type { PaginationListItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import type { ShonkLocale } from '@/locales';
import { reactiveOmit } from '@vueuse/core';
import { PaginationListItem } from 'reka-ui';
import { buttonVariants } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationListItemProps & {
	size?: ButtonVariants['size'];
	class?: HTMLAttributes['class'];
	isActive?: boolean;
	locale?: Partial<ShonkLocale['pagination']>;
}>(), {
	size: 'icon',
});

const locale = useLocale(() => ({ pagination: props.locale }));

const delegatedProps = reactiveOmit(props, 'class', 'size', 'isActive', 'locale');
</script>

<template>
	<PaginationListItem
		data-slot="pagination-item"
		v-bind="delegatedProps"
		:aria-label="locale.pagination.pageButtonAriaLabel(value)"
		:class="cn(
			buttonVariants({
				variant: isActive ? 'secondary' : 'ghost',
				size,
			}),
			props.class)"
	>
		<slot />
	</PaginationListItem>
</template>
