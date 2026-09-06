<script setup lang="ts">
import { Button, RangeDatePicker } from 'shonk-ui';
import { ref } from 'vue';

const dates = ref<Date[]>([]);

function setLastDays(days: number) {
  const end = new Date(2026, 5, 17);
  const start = new Date(2026, 5, 17 - days);

  dates.value = [start, end];
}
</script>

<template>
  <RangeDatePicker v-model="dates" trigger-placeholder="Pick a date range">
    <div class="flex flex-col gap-1 border-l p-2">
      <Button variant="ghost" class="justify-start" @click="setLastDays(7)">Last 7 days</Button>
      <Button variant="ghost" class="justify-start" @click="setLastDays(30)">Last 30 days</Button>
      <Button variant="ghost" class="justify-start" @click="setLastDays(90)">Last 90 days</Button>
    </div>
  </RangeDatePicker>
</template>
