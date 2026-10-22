<script setup lang="ts" generic="T extends AcceptableValue = AcceptableValue, O extends ComboboxOption<T> = ComboboxOption<T>">
import type { AcceptableValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ComboboxOption } from './types';
import type { ShonkLocale } from '@/locales';
import { CheckIcon, ChevronDownIcon, XIcon } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
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
import { comboboxTriggerVariants } from './variants';

const props = defineProps<{
	options: O[];
	disabled?: boolean;
	loading?: boolean;
	clearable?: boolean;
	manualFilter?: boolean;
	class?: HTMLAttributes['class'];
	contentClass?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['combobox']>;
}>();

defineSlots<{
	option?: (props: { option: O }) => unknown;
	value?: (props: { option: O }) => unknown;
	empty?: () => unknown;
}>();

const model = defineModel<T>();
const search = defineModel<string>('search', { default: '' });

const locale = useLocale(() => ({ combobox: props.locale }));

const open = ref(false);

const lastSelectedOption = ref<O>();

watch(
	[model, () => props.options],
	([value]) => {
		const selectedOption = props.options.find(option => option.value === value);
		const cleared = value === undefined || value === null;

		if (selectedOption)
			lastSelectedOption.value = selectedOption;
		else if (cleared)
			lastSelectedOption.value = undefined;
	},
	{ immediate: true },
);

const showClear = computed(() => props.clearable && !!lastSelectedOption.value && !props.disabled);

function onUpdate() {
	open.value = false;
}

function clear() {
	model.value = undefined;
	lastSelectedOption.value = undefined;
	search.value = '';
}
</script>

<template>
	<Popover v-model:open="open">
		<div class="relative w-full">
			<PopoverTrigger as-child>
				<Button
					variant="secondary"
					role="combobox"
					:aria-expanded="open"
					:disabled="disabled"
					:class="cn('bg-field text-field-foreground', comboboxTriggerVariants({ showClear, placeholder: !lastSelectedOption }), props.class)"
				>
					<slot v-if="lastSelectedOption" name="value" :option="lastSelectedOption">
						<slot name="option" :option="lastSelectedOption">
							<span class="whitespace-nowrap">{{ lastSelectedOption.label }}</span>
						</slot>
					</slot>
					<span v-else class="whitespace-nowrap">{{ locale.combobox.triggerPlaceholder }}</span>
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

		<PopoverContent align="start" :class="cn('p-0', contentClass)">
			<Command
				v-model="model"
				:manual-filter
				@update:model-value="onUpdate"
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
						<CommandEmpty>
							<slot name="empty">
								{{ locale.combobox.emptyText }}
							</slot>
						</CommandEmpty>
						<CommandGroup>
							<CommandItem
								v-for="option in options"
								:key="String(option.value)"
								:value="option.value"
								:disabled="option.disabled"
							>
								<CheckIcon :class="cn('size-4', model === option.value ? 'opacity-100' : 'opacity-0')" />
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
		</PopoverContent>
	</Popover>
</template>
