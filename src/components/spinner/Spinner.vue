<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { Loader2Icon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['spinner']>;
}>();

const locale = useLocale(() => ({ spinner: props.locale }));
</script>

<template>
	<Loader2Icon
		role="status"
		:aria-label="locale.spinner.ariaLabel"
		:class="cn('size-4 animate-spin', props.class)"
	/>
</template>
