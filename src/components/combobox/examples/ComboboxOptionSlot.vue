<script setup lang="ts">
import { Combobox } from 'shonk-ui';
import { ref } from 'vue';

const tokens = [
	{ label: 'Bitcoin', value: 'BTC', color: 'bg-orange-500' },
	{ label: 'Ethereum', value: 'ETH', color: 'bg-indigo-500' },
	{ label: 'Solana', value: 'SOL', color: 'bg-fuchsia-500' },
	{ label: 'Dogecoin', value: 'DOGE', color: 'bg-amber-400' },
	{ label: 'USD Coin', value: 'USDC', color: 'bg-sky-500' },
];

const value = ref<string>();
</script>

<template>
	<Combobox
		v-model="value"
		clearable
		:options="tokens"
		trigger-placeholder="Select token…"
		search-placeholder="Search token…"
		empty-text="No token found."
	>
		<template #option="{ option }">
			<span class="size-4 shrink-0 rounded-full" :class="option.color" />
			{{ option.label }}
		</template>
	</Combobox>
</template>
