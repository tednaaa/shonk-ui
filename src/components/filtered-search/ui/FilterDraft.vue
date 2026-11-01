<script setup lang="ts">
import type { FilterTokenSegment, TokenParts } from '../types';
import { useLocale } from '@/locales';
import { filterTokenPartVariants, filterTokenVariants } from '../variants';

const props = defineProps<{
	parts: TokenParts;
	rounded: 'start' | 'end';
	editable?: FilterTokenSegment[];
}>();

const emit = defineEmits<{ edit: [segment: FilterTokenSegment] }>();

const locale = useLocale();

function segmentAriaLabel(segment: FilterTokenSegment, fallback: string) {
	const keyLabel = props.parts.key ?? fallback;
	return segment === 'key'
		? locale.value.filteredSearch.changeKeyButtonAriaLabel(keyLabel)
		: locale.value.filteredSearch.changeOperatorButtonAriaLabel(keyLabel);
}
</script>

<template>
	<span :class="filterTokenVariants({ rounded })">
		<template v-for="(label, part) in parts" :key="part">
			<button
				v-if="label && editable?.includes(part)"
				type="button"
				:aria-label="segmentAriaLabel(part, label)"
				:class="filterTokenPartVariants({ part, editable: true })"
				@click="emit('edit', part)"
			>
				<span class="truncate">{{ label }}</span>
			</button>
			<span v-else-if="label" :class="filterTokenPartVariants({ part })">
				<span class="truncate">{{ label }}</span>
			</span>
		</template>
	</span>
</template>
