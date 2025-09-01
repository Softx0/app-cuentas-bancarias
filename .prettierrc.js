module.exports = {
  // Base Prettier config
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  
  // Code formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // React/JSX specific
  jsxBracketSameLine: false,
  
  // File patterns
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 200,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
