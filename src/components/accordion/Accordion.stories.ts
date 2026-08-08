import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '.';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
  },
  render: render(
    { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
    `<Accordion v-bind="args" class="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern and is fully keyboard navigable.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It ships with styles that match the rest of the component set.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. The expand and collapse transitions are animated by default.</AccordionContent>
      </AccordionItem>
    </Accordion>
    `,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const OpenByDefault: Story = {
  args: { defaultValue: 'item-1' },
};

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['item-1', 'item-2'] },
};

export const Disabled: Story = {
  args: { disabled: true },
};
