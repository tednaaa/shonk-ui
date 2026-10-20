import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { onBeforeUnmount, ref } from 'vue';
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from '.';
import { Bubble, BubbleContent } from '../bubble';
import { Button } from '../button';
import { Message, MessageContent } from '../message';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	text: string;
}

const components = {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
	Bubble,
	BubbleContent,
	Button,
	Message,
	MessageContent,
};

const reply = 'Sure. Start with the slowest query in the log, add an index on the column it filters by, then rerun the benchmark. If latency is still above the target, look at the N+1 calls in the list endpoint: batching them usually cuts the remaining time in half. Once both are done, set an alert on p95 so a regression shows up before users notice it.';

function history(): ChatMessage[] {
	return Array.from({ length: 6 }, (_, index) => ({
		id: `history-${index}`,
		role: index % 2 === 0 ? 'user' : 'assistant',
		text: index % 2 === 0 ? `Question ${index / 2 + 1}: how do I speed up the dashboard?` : 'Profile it first, then fix the biggest offender.',
	}));
}

const meta: Meta<typeof MessageScroller> = {
	title: 'Chat/MessageScroller',
	component: MessageScroller,
	tags: ['autodocs'],
	render: () => ({
		components,
		setup() {
			const messages = ref<ChatMessage[]>(history());
			let timer: ReturnType<typeof setInterval> | undefined;

			function send() {
				clearInterval(timer);
				const turn = messages.value.length;
				messages.value.push({ id: `user-${turn}`, role: 'user', text: 'And after that?' });
				messages.value.push({ id: `assistant-${turn}`, role: 'assistant', text: '' });
				const words = reply.split(' ');
				let index = 0;
				timer = setInterval(() => {
					const last = messages.value.at(-1);
					if (!last || index >= words.length) {
						clearInterval(timer);
						return;
					}
					last.text = words.slice(0, ++index).join(' ');
				}, 60);
			}

			onBeforeUnmount(() => clearInterval(timer));

			return { messages, send };
		},
		template: `
  <div class="flex max-w-lg flex-col gap-3">
    <MessageScrollerProvider auto-scroll>
      <MessageScroller class="h-96 rounded-xl border">
        <MessageScrollerViewport>
          <MessageScrollerContent class="gap-4 p-4">
            <MessageScrollerItem
              v-for="message in messages"
              :key="message.id"
              :message-id="message.id"
              :scroll-anchor="message.role === 'user'"
            >
              <Message :align="message.role === 'user' ? 'end' : 'start'">
                <MessageContent>
                  <Bubble
                    :variant="message.role === 'user' ? 'default' : 'ghost'"
                    :align="message.role === 'user' ? 'end' : 'start'"
                  >
                    <BubbleContent>{{ message.text || '…' }}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
    <Button class="self-end" @click="send">Send a message</Button>
  </div>
`,
	}),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
