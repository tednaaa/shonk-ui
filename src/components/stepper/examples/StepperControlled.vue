<script setup lang="ts">
import {
  Button,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'shonk-ui';
import { ref } from 'vue';

const steps = [
  { step: 1, title: 'Details', description: 'Your info' },
  { step: 2, title: 'Shipping', description: 'Pick a method' },
  { step: 3, title: 'Payment', description: 'Card details' },
  { step: 4, title: 'Review', description: 'Confirm order' },
];

const current = ref(1);
</script>

<template>
  <div class="space-y-8">
    <Stepper v-model="current" class="items-start">
      <StepperItem
        v-for="step in steps"
        :key="step.step"
        :step="step.step"
        class="relative flex-1 flex-col"
      >
        <StepperTrigger>
          <StepperIndicator>{{ step.step }}</StepperIndicator>
          <div class="flex flex-col items-center">
            <StepperTitle>{{ step.title }}</StepperTitle>
            <StepperDescription>{{ step.description }}</StepperDescription>
          </div>
        </StepperTrigger>
        <StepperSeparator
          v-if="step.step < steps.length"
          class="absolute top-4 left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] h-0.5 rounded-full"
        />
      </StepperItem>
    </Stepper>

    <div class="flex justify-between">
      <Button variant="outline" :disabled="current === 1" @click="current--">Back</Button>
      <Button :disabled="current === steps.length" @click="current++">Next</Button>
    </div>
  </div>
</template>
