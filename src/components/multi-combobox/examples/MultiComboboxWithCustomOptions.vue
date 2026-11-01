<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarGroup, MultiCombobox } from 'shonk-ui';
import { ref } from 'vue';

const tokens = [
	{ label: 'Bitcoin', value: 'BTC', color: 'bg-orange-500' },
	{ label: 'Ethereum', value: 'ETH', color: 'bg-indigo-500' },
	{ label: 'Solana', value: 'SOL', color: 'bg-fuchsia-500' },
	{ label: 'Dogecoin', value: 'DOGE', color: 'bg-amber-400' },
	{ label: 'USD Coin', value: 'USDC', color: 'bg-sky-500' },
];

const members = [
	{ label: 'Olivia Martin', value: 'olivia', role: 'Designer' },
	{ label: 'Jackson Lee', value: 'jackson', role: 'Engineer' },
	{ label: 'Isabella Nguyen', value: 'isabella', role: 'Engineer' },
	{ label: 'William Kim', value: 'william', role: 'Product manager' },
];

const selectedTokens = ref(['BTC', 'ETH']);
const selectedMembers = ref(['jackson']);
</script>

<template>
	<div class="grid gap-4">
		<MultiCombobox
			v-model="selectedTokens"
			:options="tokens"
			:locale="{ triggerPlaceholder: 'Select tokens…', allText: 'All tokens', searchPlaceholder: 'Search token…' }"
		>
			<template #option="{ option }">
				<span class="size-4 shrink-0 rounded-full" :class="option.color" />
				{{ option.label }}
			</template>

			<template #value="{ selected, text }">
				<span class="flex gap-1">
					<span
						v-for="option in selected"
						:key="option.value"
						class="size-4 shrink-0 rounded-full"
						:class="option.color"
					/>
				</span>
				<span class="truncate">{{ text }}</span>
			</template>
		</MultiCombobox>

		<MultiCombobox
			v-model="selectedMembers"
			:options="members"
			:locale="{ triggerPlaceholder: 'Select members…', allText: 'All members', searchPlaceholder: 'Search member…' }"
		>
			<template #option="{ option }">
				<Avatar class="size-7">
					<AvatarFallback :name="option.label" />
				</Avatar>
				<span class="grid leading-tight">
					{{ option.label }}
					<span class="text-xs text-muted-foreground">{{ option.role }}</span>
				</span>
			</template>

			<template #value="{ selected, text }">
				<AvatarGroup class="-space-x-1.5">
					<Avatar
						v-for="option in selected"
						:key="option.value"
						class="size-5"
					>
						<AvatarFallback :name="option.label" />
					</Avatar>
				</AvatarGroup>
				<span class="truncate">{{ text }}</span>
			</template>
		</MultiCombobox>
	</div>
</template>
