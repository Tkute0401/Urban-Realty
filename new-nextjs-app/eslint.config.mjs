import next from 'eslint-config-next'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'

export default [
  ...next,
  { ignores: ['.next', 'dist'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': reactHooks, 'react': react },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-danger': 'warn',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/style-prop-object': 'error',
      'react/forbid-component-props': ['error', { forbid: [{ propName: 'style' }] }],
    },
  },
]

