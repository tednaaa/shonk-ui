<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { MoreHorizontal } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['breadcrumb']>;
}>();

const locale = useLocale(() => ({ breadcrumb: props.locale }));
</script>

<template>
	<span
		data-slot="breadcrumb-ellipsis"
		role="presentation"
		aria-hidden="true"
		:class="cn('flex size-9 items-center justify-center', props.class)"
	>
		<slot>
			<MoreHorizontal class="size-4" />
		</slot>
		<span class="sr-only">{{ locale.breadcrumb.ellipsisScreenReaderText }}</span>
	</span>
</template>
