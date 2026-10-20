import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { AlertCircleIcon, CheckIcon, FileSearchIcon, GlobeIcon, TerminalIcon } from '@lucide/vue';
import { render } from '@/lib/storybook';
import {
	Trace,
	TraceCollapsible,
	TraceCollapsibleContent,
	TraceCollapsibleTrigger,
	TraceDescription,
	TraceIcon,
	TraceLine,
	TraceTitle,
} from '.';
import { Spinner } from '../spinner';

const components = {
	Trace,
	TraceCollapsible,
	TraceCollapsibleContent,
	TraceCollapsibleTrigger,
	TraceDescription,
	TraceIcon,
	TraceLine,
	TraceTitle,
	Spinner,
	AlertCircleIcon,
	CheckIcon,
	FileSearchIcon,
	GlobeIcon,
	TerminalIcon,
};

const meta: Meta<typeof Trace> = {
	title: 'Chat/Trace',
	component: Trace,
	tags: ['autodocs'],
	render: render(
		components,
		`<Trace class="max-w-md">
      <TraceLine>
        <TraceIcon><CheckIcon /></TraceIcon>
        <TraceTitle>Read the error log</TraceTitle>
        <TraceDescription>1.2s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon><CheckIcon /></TraceIcon>
        <TraceTitle>Searched the codebase for the failing handler</TraceTitle>
        <TraceDescription>3 files</TraceDescription>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon><Spinner class="size-4" /></TraceIcon>
        <TraceTitle>Running the test suite</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon><TerminalIcon /></TraceIcon>
        <TraceTitle>Deploy to staging</TraceTitle>
      </TraceLine>
    </Trace>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
	render: render(
		components,
		`<Trace class="max-w-md">
      <TraceLine>
        <TraceIcon><CheckIcon /></TraceIcon>
        <TraceTitle>Done</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon><Spinner class="size-4" /></TraceIcon>
        <TraceTitle>Running</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon><TerminalIcon /></TraceIcon>
        <TraceTitle>Pending</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon><AlertCircleIcon /></TraceIcon>
        <TraceTitle>Request failed</TraceTitle>
        <TraceDescription>503</TraceDescription>
      </TraceLine>
    </Trace>`,
	),
};

export const ToolCall: Story = {
	render: render(
		components,
		`<Trace class="max-w-md">
      <TraceCollapsible :default-open="true">
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon><GlobeIcon /></TraceIcon>
            <TraceTitle>Searched the web</TraceTitle>
            <TraceDescription>4 sources</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <ul class="flex flex-col gap-1 text-sm">
            <li>reka-ui.com — Drawer API</li>
            <li>tailwindcss.com — scrollbar utilities</li>
            <li>vueuse.org — useDropZone</li>
            <li>developer.mozilla.org — DataTransfer</li>
          </ul>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon><FileSearchIcon /></TraceIcon>
            <TraceTitle>Read config.ts</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <pre class="text-xs">export default { retries: 3 }</pre>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>`,
	),
};
