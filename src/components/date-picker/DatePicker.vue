<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import type { WeekStartsOn } from 'reka-ui/date';
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { CalendarDate } from '@internationalized/date';
import { CalendarIcon } from '@lucide/vue';
import { computed, ref } from 'vue';
import { formatDate } from '@/lib/date';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { Calendar } from '../calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../popover';

const props = withDefaults(defineProps<{
	closeOnSelect?: boolean;
	minValue?: DateValue;
	maxValue?: DateValue;
	isDateDisabled?: (date: DateValue) => boolean;
	formatter?: (date: Date) => string;
	weekStartsOn?: WeekStartsOn;
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['datePicker'] & Pick<ShonkLocale, 'intlLocale'>>;
}>(), {
	closeOnSelect: true,
	weekStartsOn: 1,
});

const date = defineModel<Date>();
const open = ref(false);

const locale = useLocale(() => ({ intlLocale: props.locale?.intlLocale, datePicker: props.locale }));

const calendarValue = computed<DateValue | undefined>(() => {
	const value = date.value;
	return value ? new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate()) : undefined;
});

function onUpdate(value: DateValue | undefined) {
	date.value = value ? new Date(value.year, value.month - 1, value.day, 0, 0, 0, 0) : undefined;

	if (props.closeOnSelect && value)
		open.value = false;
}

const displayValue = computed(() => {
	return date.value ? formatDate(date.value, props.formatter) : '';
});

function close() {
	open.value = false;
}

defineExpose({ close });
</script>

<template>
	<Popover v-model:open="open">
		<PopoverTrigger as-child>
			<Button
				variant="secondary"
				:class="cn('w-55 justify-start bg-field text-left font-normal text-field-foreground', !displayValue && 'text-muted-foreground', props.class)"
			>
				<CalendarIcon :size="16" />
				<span>{{ displayValue || (locale.datePicker.triggerPlaceholder) }}</span>
			</Button>
		</PopoverTrigger>
		<PopoverContent align="start" side="top" class="w-auto overflow-hidden p-0">
			<div class="flex">
				<Calendar
					class="w-72"
					disable-days-outside-current-view
					:week-starts-on="props.weekStartsOn"
					:model-value="calendarValue"
					:min-value="props.minValue"
					:max-value="props.maxValue"
					:is-date-disabled="props.isDateDisabled"
					@update:model-value="onUpdate"
				/>

				<slot />
			</div>
		</PopoverContent>
	</Popover>
</template>
