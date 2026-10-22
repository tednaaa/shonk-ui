<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui';
import type { ShonkLocale } from '@/locales';
import { reactiveOmit } from '@vueuse/core';
import { useForwardPropsEmits } from 'reka-ui';
import { useLocale } from '@/locales';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../dialog';
import Command from './Command.vue';

const props = defineProps<DialogRootProps & {
	locale?: Partial<ShonkLocale['command']>;
}>();
const emits = defineEmits<DialogRootEmits>();

const locale = useLocale(() => ({ command: props.locale }));

const delegatedProps = reactiveOmit(props, 'locale');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<Dialog #default="slotProps" v-bind="forwarded">
		<DialogContent class="overflow-hidden p-0 ">
			<DialogHeader class="sr-only">
				<DialogTitle>{{ locale.command.screenReaderTitle }}</DialogTitle>
				<DialogDescription>{{ locale.command.screenReaderDescription }}</DialogDescription>
			</DialogHeader>
			<Command>
				<slot v-bind="slotProps" />
			</Command>
		</DialogContent>
	</Dialog>
</template>
