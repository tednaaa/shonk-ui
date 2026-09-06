import { SyntaxHighlighter } from 'storybook/internal/components';

interface Prism {
  languages: Record<string, unknown> & {
    markup: { tag: { addInlined: (tagName: string, language: string) => void } };
  };
}

function vue(prism: Prism) {
  prism.languages.markup.tag.addInlined('script', 'typescript');
  prism.languages.vue = prism.languages.markup;
}

vue.displayName = 'vue';

export function registerVueGrammar() {
  SyntaxHighlighter.registerLanguage('vue', vue);
}
