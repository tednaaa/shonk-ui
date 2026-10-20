import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
	MessageGroup,
	MessageHeader,
} from '.';
import { Avatar, AvatarFallback } from '../avatar';
import { Bubble, BubbleContent } from '../bubble';

const components = {
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
	MessageGroup,
	MessageHeader,
	Avatar,
	AvatarFallback,
	Bubble,
	BubbleContent,
};

const meta: Meta<typeof Message> = {
	title: 'Chat/Message',
	component: Message,
	tags: ['autodocs'],
	render: render(
		components,
		`<Message v-bind="args" class="max-w-lg">
      <MessageAvatar><Avatar class="size-8"><AvatarFallback>AL</AvatarFallback></Avatar></MessageAvatar>
      <MessageContent>
        <MessageHeader>Alex</MessageHeader>
        <Bubble variant="secondary" :align="args.align">
          <BubbleContent>Did the deploy go through?</BubbleContent>
        </Bubble>
        <MessageFooter>10:42</MessageFooter>
      </MessageContent>
    </Message>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Conversation: Story = {
	render: render(
		components,
		`<MessageGroup class="max-w-lg gap-4">
      <Message>
        <MessageAvatar><Avatar class="size-8"><AvatarFallback>AL</AvatarFallback></Avatar></MessageAvatar>
        <MessageContent>
          <Bubble variant="secondary"><BubbleContent>Did the deploy go through?</BubbleContent></Bubble>
          <Bubble variant="secondary"><BubbleContent>Staging looked stuck a minute ago.</BubbleContent></Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end"><BubbleContent>Yes, it's live. The stuck job was a cache warm-up.</BubbleContent></Bubble>
          <MessageFooter>Read 10:44</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>`,
	),
};

export const Ghost: Story = {
	render: render(
		components,
		`<Message class="max-w-lg">
      <MessageContent>
        <MessageHeader>Assistant</MessageHeader>
        <Bubble variant="ghost">
          <BubbleContent>A ghost bubble drops the background, so long answers read as plain text in the transcript.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>`,
	),
};
