<script setup lang="ts">
import type { ActiveFilter, FilterTokenSegment } from './types';
import { GripVerticalIcon, XIcon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { filterTokenPartVariants, filterTokenVariants } from './variants';

const props = withDefaults(defineProps<{ filter: ActiveFilter; removable?: boolean; editable?: boolean; draggable?: boolean }>(), {
	removable: true,
	editable: false,
	draggable: false,
});

const emit = defineEmits<{ remove: [id: string]; edit: [id: string, segment: FilterTokenSegment]; dragStart: [event: PointerEvent] }>();

defineSlots<{
	value?: () => unknown;
}>();

const locale = useLocale();

function edit(segment: FilterTokenSegment) {
	if (props.editable)
		emit('edit', props.filter.id, segment);
}
</script>

<template>
	<span :class="filterTokenVariants()">
		<span
			v-if="draggable"
			data-slot="filter-token-handle"
			aria-hidden="true"
			:class="filterTokenPartVariants({ part: 'handle' })"
			@pointerdown="emit('dragStart', $event)"
		>
			<GripVerticalIcon class="size-3" />
		</span>
		<component
			:is="editable ? 'button' : 'span'"
			:type="editable ? 'button' : undefined"
			:aria-label="editable ? locale.filteredSearch.changeKeyButtonAriaLabel(filter.keyLabel) : undefined"
			:class="filterTokenPartVariants({ part: 'key', editable })"
			@click="edit('key')"
		>
			<span class="truncate">{{ filter.keyLabel }}</span>
		</component>
		<component
			:is="editable ? 'button' : 'span'"
			:type="editable ? 'button' : undefined"
			:aria-label="editable ? locale.filteredSearch.changeOperatorButtonAriaLabel(filter.keyLabel) : undefined"
			:class="filterTokenPartVariants({ part: 'operator', editable })"
			@click="edit('operator')"
		>
			{{ filter.operatorLabel }}
		</component>
		<span :class="filterTokenPartVariants({ part: 'value', editable })">
			<component
				:is="editable ? 'button' : 'span'"
				:type="editable ? 'button' : undefined"
				:aria-label="editable ? locale.filteredSearch.editFilterButtonAriaLabel(filter.keyLabel) : undefined"
				class="min-w-0 cursor-[inherit] truncate rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				@click="edit('value')"
			>
				<slot name="value">
					{{ filter.valueLabel }}
				</slot>
			</component>
			<button
				v-if="removable"
				type="button"
				class="shrink-0 cursor-pointer rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				:aria-label="locale.filteredSearch.removeFilterButtonAriaLabel(filter.keyLabel)"
				@click.stop="emit('remove', filter.id)"
			>
				<XIcon class="size-3" />
			</button>
		</span>
	</span>
</template>
