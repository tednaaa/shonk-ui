import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { showControls } from '@/lib/storybook';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '.';

const components = {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
};

const guides = [
	{ title: 'Introduction', description: 'Re-usable components built on reka-ui and Tailwind CSS.' },
	{ title: 'Installation', description: 'How to install dependencies and structure your app.' },
	{ title: 'Typography', description: 'Styles for headings, paragraphs, lists and more.' },
];

const entries = [
	{ title: 'Dialog', description: 'A window overlaid on the primary window.' },
	{ title: 'Hover Card', description: 'Preview content available behind a link.' },
	{ title: 'Progress', description: 'Shows the completion progress of a task.' },
	{ title: 'Tabs', description: 'Layered sections of content, one shown at a time.' },
];

function menu(indicator: boolean) {
	return (args: unknown) => ({
		components,
		setup: () => ({ args, guides, entries, triggerStyle: navigationMenuTriggerStyle }),
		template: `
  <NavigationMenu v-bind="args">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-96 gap-1">
            <li v-for="item in guides" :key="item.title">
              <NavigationMenuLink href="#">
                <div class="font-medium">{{ item.title }}</div>
                <p class="line-clamp-2 text-muted-foreground">{{ item.description }}</p>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[32rem] grid-cols-2 gap-1">
            <li v-for="item in entries" :key="item.title">
              <NavigationMenuLink href="#">
                <div class="font-medium">{{ item.title }}</div>
                <p class="line-clamp-2 text-muted-foreground">{{ item.description }}</p>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#" :class="triggerStyle()">Docs</NavigationMenuLink>
      </NavigationMenuItem>
      ${indicator ? '<NavigationMenuIndicator />' : ''}
    </NavigationMenuList>
  </NavigationMenu>
`,
	});
}

const meta: Meta<typeof NavigationMenu> = {
	title: 'Navigation/NavigationMenu',
	component: NavigationMenu,
	tags: ['autodocs'],
	render: menu(false),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const WithIndicator: Story = {
	render: menu(true),
};

export const Links: Story = {
	render: () => ({
		components,
		setup: () => ({ triggerStyle: navigationMenuTriggerStyle }),
		template: `
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem v-for="link in ['Home', 'Pricing', 'Blog', 'Contact']" :key="link">
        <NavigationMenuLink href="#" :active="link === 'Home'" :class="triggerStyle()">{{ link }}</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
`,
	}),
};
