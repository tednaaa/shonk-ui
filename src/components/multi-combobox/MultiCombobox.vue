<script setup lang="ts" generic="T extends AcceptableValue = AcceptableValue, O extends ComboboxOption<T> = ComboboxOption<T>">
import type { AcceptableValue, PopoverContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ComboboxOption } from '../combobox';
import type { ShonkLocale } from '@/locales';
import { ChevronDownIcon, XIcon } from '@lucide/vue';
import { useFilter } from 'reka-ui';
import { computed, shallowRef, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Spinner } from '../spinner';
import { multiComboboxTriggerVariants } from './variants';

const props = withDefaults(defineProps<{
	options: O[];
	disabled?: boolean;
	loading?: boolean;
	clearable?: boolean;
	manualFilter?: boolean;
	pinSelectedOption?: boolean;
	hideFooter?: boolean;
	align?: PopoverContentProps['align'];
	class?: HTMLAttributes['class'];
	contentClass?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['combobox'] & ShonkLocale['multiCombobox']>;
}>(), {
	align: 'start',
});

defineSlots<{
	option?: (props: { option: O }) => unknown;
	value?: (props: { selected: O[]; text: string }) => unknown;
	empty?: () => unknown;
	trigger?: (props: { selected: O[]; text: string }) => unknown;
	action?: () => unknown;
	footer?: () => unknown;
}>();

const model = defineModel<T[]>({ default: () => [] });
const search = defineModel<string>('search', { default: '' });
const open = defineModel<boolean>('open', { default: false });

const locale = useLocale(() => ({ combobox: props.locale, multiCombobox: props.locale }));

const pinnedValues = shallowRef<T[]>([]);

watch(open, (isOpen) => {
	if (isOpen)
		pinnedValues.value = [...model.value];
	else
		search.value = '';
}, { immediate: true });

const { contains } = useFilter({ sensitivity: 'base' });

const knownOptions = shallowRef(new Map<T, O>());
watch(
	() => props.options,
	(options) => {
		knownOptions.value = new Map([...knownOptions.value, ...options.map((option): [T, O] => [option.value, option])]);
	},
	{ immediate: true },
);

const selectedOptions = computed(() => model.value.flatMap((value) => {
	const option = knownOptions.value.get(value);
	return option ? [option] : [];
}));

const listedOptions = computed(() => props.pinSelectedOption
	? [
			...props.options.filter(option => pinnedValues.value.includes(option.value)),
			...props.options.filter(option => !pinnedValues.value.includes(option.value)),
		]
	: props.options);

const selectableOptions = computed(() => props.options.filter(option => !option.disabled));

const visibleOptions = computed(() => props.manualFilter
	? selectableOptions.value
	: selectableOptions.value.filter(option => contains(option.label, search.value)));

const allSelected = computed(() => selectableOptions.value.length > 0
	&& selectableOptions.value.every(option => isSelected(option.value)));

const visibleSelection = computed(() => {
	const selectedCount = visibleOptions.value.filter(option => isSelected(option.value)).length;
	if (selectedCount === 0)
		return false;
	return selectedCount === visibleOptions.value.length ? true : 'indeterminate';
});

const triggerText = computed(() => {
	const [first] = model.value;
	if (first === undefined)
		return locale.value.combobox.triggerPlaceholder;
	if (allSelected.value)
		return locale.value.multiCombobox.allText;
	if (model.value.length === 1)
		return knownOptions.value.get(first)?.label ?? locale.value.multiCombobox.selectedCountText(1);
	return locale.value.multiCombobox.selectedCountText(model.value.length);
});

const countText = computed(() => allSelected.value
	? locale.value.multiCombobox.allSelectedCountText(selectableOptions.value.length)
	: locale.value.multiCombobox.selectedOfTotalText(model.value.length, selectableOptions.value.length));

const showClear = computed(() => props.clearable && model.value.length > 0 && !props.disabled);

function isSelected(value: T) {
	return model.value.includes(value);
}

function toggle(value: T) {
	model.value = isSelected(value)
		? model.value.filter(selected => selected !== value)
		: [...model.value, value];
}

function toggleVisibleOptions() {
	const visibleValues = visibleOptions.value.map(option => option.value);
	model.value = visibleSelection.value === true
		? model.value.filter(selected => !visibleValues.includes(selected))
		: [...model.value, ...visibleValues.filter(value => !isSelected(value))];
}

function reset() {
	model.value = [];
}

function clear() {
	reset();
	search.value = '';
}
</script>

<template>
	<Popover v-model:open="open">
		<PopoverTrigger v-if="$slots.trigger" as-child>
			<slot name="trigger" :selected="selectedOptions" :text="triggerText" />
		</PopoverTrigger>

		<div v-else class="relative w-full min-w-0">
			<PopoverTrigger as-child>
				<Button
					variant="secondary"
					role="combobox"
					:aria-expanded="open"
					:disabled="disabled"
					:class="cn(multiComboboxTriggerVariants({ showClear, placeholder: model.length === 0 }), props.class)"
				>
					<span class="flex min-w-0 items-center gap-2">
						<slot name="value" :selected="selectedOptions" :text="triggerText">
							<span class="truncate">{{ triggerText }}</span>
						</slot>
					</span>
				</Button>
			</PopoverTrigger>

			<div class="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
				<button
					v-if="showClear"
					type="button"
					:aria-label="locale.combobox.clearButtonAriaLabel"
					tabindex="-1"
					class="pointer-events-auto cursor-pointer rounded-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
					@pointerdown.stop.prevent="clear"
				>
					<XIcon class="size-4" />
				</button>
				<ChevronDownIcon class="size-4 opacity-50" />
			</div>
		</div>

		<PopoverContent :align="align" :class="cn('p-0', contentClass)">
			<Command
				:model-value="model"
				multiple
				highlight-on-hover
				:manual-filter
			>
				<CommandInput
					:placeholder="locale.combobox.searchPlaceholder"
					@update:model-value="(v: string) => (search = v)"
				/>
				<CommandList>
					<div
						v-if="loading"
						class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
					>
						<Spinner />
						<span>{{ locale.combobox.loadingText }}</span>
					</div>
					<template v-else>
						<label
							v-if="visibleOptions.length > 0"
							class="flex w-full cursor-pointer items-center gap-2 border-b px-3 py-2 text-sm font-medium select-none"
						>
							<Checkbox
								:model-value="visibleSelection"
								@update:model-value="toggleVisibleOptions"
							/>
							{{ locale.multiCombobox.selectAllText }}
						</label>
						<CommandEmpty>
							<slot name="empty">
								{{ locale.combobox.emptyText }}
							</slot>
						</CommandEmpty>
						<CommandGroup>
							<CommandItem
								v-for="option in listedOptions"
								:key="String(option.value)"
								:value="option.value"
								:disabled="option.disabled"
								@select="toggle(option.value)"
							>
								<Checkbox
									:model-value="isSelected(option.value)"
									tabindex="-1"
									aria-hidden="true"
									class="pointer-events-none"
								/>
								<slot
									name="option"
									:option="option"
								>
									{{ option.label }}
								</slot>
							</CommandItem>
						</CommandGroup>
					</template>
				</CommandList>
			</Command>

			<slot name="action" />

			<slot v-if="!hideFooter" name="footer">
				<div class="flex items-center justify-between gap-2 border-t py-1 pr-3 pl-1">
					<Button
						variant="ghost"
						size="sm"
						:disabled="model.length === 0"
						@click="reset"
					>
						{{ locale.multiCombobox.resetButtonText }}
					</Button>
					<span class="text-xs text-muted-foreground tabular-nums">{{ countText }}</span>
				</div>
			</slot>
		</PopoverContent>
	</Popover>
</template>
