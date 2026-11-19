<script setup lang="ts">
import { Combobox } from 'shonk-ui';
import { ref } from 'vue';

const frameworks = [
	{ label: 'Next.js', value: 'next' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'SvelteKit', value: 'svelte' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Astro', value: 'astro' },
];

const value = ref('nuxt');
</script>

<template>
	<Combobox
		v-model="value"
		clearable
		:options="frameworks"
		:locale="{ triggerPlaceholder: 'Select framework…', searchPlaceholder: 'Search framework…', emptyText: 'No framework found.' }"
	/>
</template>
