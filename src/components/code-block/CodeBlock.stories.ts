import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { TerminalIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import {
	CodeBlock,
	CodeBlockActions,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockHeader,
	CodeBlockLine,
	CodeBlockTitle,
	CodeBlockToken,
	useHighlightedCode,
} from '.';

const components = {
	CodeBlock,
	CodeBlockActions,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockHeader,
	CodeBlockLine,
	CodeBlockTitle,
	CodeBlockToken,
	TerminalIcon,
};

const source = `import { ref } from 'vue';

export function useCounter(initial = 0) {
	const count = ref(initial);
	const increment = () => count.value++;
	return { count, increment };
}`;

const patch = ` <template>
-  <p>Hello, {{ name }}</p>
+  <p class="text-sm text-muted-foreground">
+    Hello, {{ name }}!
+  </p>
 </template>`;

function lineVariant(line: string) {
	if (line.startsWith('+'))
		return 'added';
	if (line.startsWith('-'))
		return 'removed';
	return 'default';
}

const meta: Meta<typeof CodeBlock> = {
	title: 'Data/CodeBlock',
	component: CodeBlock,
	tags: ['autodocs'],
	render: args => ({
		components,
		setup: () => ({ args, source, lines: useHighlightedCode(source, 'ts') }),
		template: `
  <CodeBlock v-bind="args" class="max-w-lg">
    <CodeBlockHeader>
      <CodeBlockTitle>composables/useCounter.ts</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton :value="source" />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent>
      <CodeBlockLine v-for="(line, index) in lines" :key="index">
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </CodeBlock>
`,
	}),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Terminal: Story = {
	render: () => ({
		components,
		setup() {
			const command = 'pnpm add shonk-ui';
			return { command, lines: useHighlightedCode(command, 'bash') };
		},
		template: `
  <CodeBlock class="max-w-lg">
    <CodeBlockHeader>
      <CodeBlockTitle><TerminalIcon />Terminal</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton :value="command" />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent>
      <CodeBlockLine v-for="(line, index) in lines" :key="index">
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </CodeBlock>
`,
	}),
};

export const LineNumbers: Story = {
	render: () => ({
		components,
		setup: () => ({ lines: useHighlightedCode(source, 'ts') }),
		template: `
  <CodeBlock class="max-w-lg">
    <CodeBlockContent line-numbers>
      <CodeBlockLine v-for="(line, index) in lines" :key="index">
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </CodeBlock>
`,
	}),
};

export const Diff: Story = {
	render: () => ({
		components,
		setup() {
			const patchLines = patch.split('\n');
			const lines = useHighlightedCode(patchLines.map(line => line.slice(1)).join('\n'), 'vue');
			return { patch, patchLines, lines, lineVariant };
		},
		template: `
  <CodeBlock class="max-w-lg">
    <CodeBlockHeader>
      <CodeBlockTitle>components/Greeting.vue</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton :value="patch" />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent>
      <CodeBlockLine v-for="(line, index) in lines" :key="index" :variant="lineVariant(patchLines[index])">
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </CodeBlock>
`,
	}),
};

export const Destructive: Story = {
	render: render(
		components,
		`<CodeBlock variant="destructive" class="max-w-lg">
      <CodeBlockContent>Error: Cannot find module 'shonk-ui/charts'</CodeBlockContent>
    </CodeBlock>`,
	),
};
