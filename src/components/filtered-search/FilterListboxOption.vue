<script setup lang="ts">
defineProps<{ highlighted: boolean }>();
</script>

<template>
	<button
		type="button"
		role="option"
		:aria-selected="highlighted"
		class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
	>
		<slot />
	</button>
</template>
