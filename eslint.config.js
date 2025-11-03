import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  // ignore padrões
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**'] },

  // regras base JS
  js.configs.recommended,

  // regras TypeScript (sem e com type-check)
  ...tseslint.configs.recommended,
  // ...tseslint.configs.recommendedTypeChecked,
  // tye check

  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 'prettier/prettier': 'off'
    },
  },

]
