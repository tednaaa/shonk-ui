<script setup lang="ts">
import { Button, MultiCombobox } from 'shonk-ui';
import { ref } from 'vue';

const frameworks = [
	{ label: 'Next.js', value: 'next' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'SvelteKit', value: 'svelte' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Astro', value: 'astro' },
];

const value = ref<string[]>([]);
const open = ref(false);
</script>

<template>
	<MultiCombobox
		v-model="value"
		v-model:open="open"
		:options="frameworks"
		:locale="{ searchPlaceholder: 'Search framework…' }"
	>
		<template #footer>
			<div class="flex justify-end gap-2 border-t p-2">
				<Button variant="ghost" size="sm" @click="value = []">
					Clear
				</Button>
				<Button size="sm" @click="open = false">
					Apply
				</Button>
			</div>
		</template>
	</MultiCombobox>
</template>
