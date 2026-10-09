<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
	<td
		data-slot="table-cell"
		:class="
			cn(
				'p-2 align-middle whitespace-nowrap has-[>[role=switch]]:leading-none *:[[role=checkbox]]:align-[-2px] *:[[role=switch]]:align-middle',
				props.class,
			)
		"
	>
		<slot />
	</td>
</template>
