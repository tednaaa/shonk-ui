<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { useLocale } from '@/locales';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['breadcrumb']>;
}>();

const locale = useLocale(() => ({ breadcrumb: props.locale }));
</script>

<template>
	<nav
		:aria-label="locale.breadcrumb.navAriaLabel"
		data-slot="breadcrumb"
		:class="props.class"
	>
		<slot />
	</nav>
</template>
