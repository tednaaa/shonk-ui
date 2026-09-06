<script setup lang="ts">
import { Button, DatePicker } from 'shonk-ui';
import { ref } from 'vue';

const date = ref<Date>();

function setDaysFromNow(days: number) {
  date.value = new Date(2026, 5, 17 + days);
}
</script>

<template>
  <DatePicker v-model="date" trigger-placeholder="Pick a date">
    <div class="flex flex-col gap-1 border-l p-2">
      <Button variant="ghost" class="justify-start" @click="setDaysFromNow(0)">Today</Button>
      <Button variant="ghost" class="justify-start" @click="setDaysFromNow(1)">Tomorrow</Button>
      <Button variant="ghost" class="justify-start" @click="setDaysFromNow(7)">In a week</Button>
    </div>
  </DatePicker>
</template>
