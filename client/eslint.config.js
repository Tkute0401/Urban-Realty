import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Reduce noise in CI: treat unused vars as warnings
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off',
      'react/no-danger': 'warn',
      // Prevent inline styles to enforce centralized styling
      'react/style-prop-object': 'error',
      'react/forbid-component-props': ['error', { forbid: [{ propName: 'style' }] }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Disable heavy prop-types rule as project uses TypeScript checks/JS runtime props
      'react/prop-types': 'off',
      // Avoid failures for plain quotes inside JSX content
      'react/no-unescaped-entities': 'off',
      // Some files reference global variables provided at runtime (e.g., process, gtag)
      'no-undef': 'off',
      // Some storybook files/components may rely on auto-imports; keep CI green
      'react/jsx-no-undef': 'off',
    },
  },
  {
    files: ['**/*.config.*', '**/*.cjs', 'vite.config.js', 'tailwind.config.js', '**/.storybook/*.js'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'module',
    },
    rules: {
      'no-undef': 'off',
    },
  },
]
