// ** ESlint config (flat config) en React/ Vite **

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([

    // Ignorés globalement (no scan)
  globalIgnores(['dist', 'dist-ssr', 'coverage', '.vite', 'node_modules']),

    // Règles pour les src front
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Autorise les const UPPER et args inutilisés préfix par _
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  }, // Fichiers de config Node (autres environnements)
  {
    files: ['*.{cjs,mjs,js}'],
    ignores: ['src/**'],
    languageOptions: { globals: globals.node },
  }
])