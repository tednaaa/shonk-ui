<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '../button';
import type { ShonkLocale } from '@/locales';
import { CheckIcon, CopyIcon } from '@lucide/vue';
import { useClipboard } from '@vueuse/core';
import { useLocale } from '@/locales';
import { Button } from '../button';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PrimitiveProps & {
	value: string;
	variant?: ButtonVariants['variant'];
	size?: ButtonVariants['size'];
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['codeBlock']>;
}>(), {
	as: 'button',
	variant: 'ghost',
	size: 'icon-xs',
});

const { copy, copied } = useClipboard({ copiedDuring: 2000, legacy: true });
const locale = useLocale(() => ({ codeBlock: props.locale }));
</script>

<template>
	<Button
		v-bind="$attrs"
		data-slot="code-block-copy-button"
		:data-copied="copied || undefined"
		:as="as"
		:as-child="asChild"
		:variant="variant"
		:size="size"
		:aria-label="copied ? locale.codeBlock.copiedText : locale.codeBlock.copyButtonAriaLabel"
		:class="props.class"
		@click="copy(props.value)"
	>
		<CheckIcon v-if="copied" />
		<CopyIcon v-else />
	</Button>
	<span aria-live="polite" class="sr-only">{{ copied ? locale.codeBlock.copiedText : '' }}</span>
</template>
