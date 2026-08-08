import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { showControls } from '@/lib/storybook';
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '.';
import { Button } from '../button';

const components = {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  Button,
};

const steps = [
  { step: 1, title: 'Details', description: 'Your info' },
  { step: 2, title: 'Shipping', description: 'Pick a method' },
  { step: 3, title: 'Payment', description: 'Card details' },
  { step: 4, title: 'Review', description: 'Confirm order' },
];

const items = `
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
`;

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  render: args => ({
    components,
    setup() {
      const current = ref(2);
      return { args, current, steps };
    },
    template: `
      <Stepper v-model="current" v-bind="args" class="w-full max-w-xl items-start">
        ${items}
      </Stepper>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Controlled: Story = {
  render: () => ({
    components,
    setup() {
      const current = ref(1);
      return { current, steps };
    },
    template: `
      <div class="w-full max-w-xl space-y-8">
        <Stepper v-model="current" class="items-start">
          ${items}
        </Stepper>
        <div class="flex justify-between">
          <Button variant="outline" :disabled="current === 1" @click="current--">Back</Button>
          <Button :disabled="current === steps.length" @click="current++">Next</Button>
        </div>
      </div>
    `,
  }),
};
