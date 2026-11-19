<script setup lang="ts">
import { MultiCombobox } from 'shonk-ui';
import { ref } from 'vue';

const frameworks = [
	{ label: 'Next.js', value: 'next' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'SvelteKit', value: 'svelte' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Astro', value: 'astro' },
];

const value = ref(['svelte', 'astro']);
</script>

<template>
	<MultiCombobox
		v-model="value"
		clearable
		pin-selected-option
		:options="frameworks"
		:locale="{ searchPlaceholder: 'Search framework…' }"
	/>
</template>
