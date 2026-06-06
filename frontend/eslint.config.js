import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // R3F render-loop code is intentionally imperative: `useFrame` must mutate
    // geometry buffers and object refs every frame, and particle systems seed
    // themselves with Math.random() once at init. The React-Compiler-aligned
    // rules below assume pure, immutable render and conflict with that idiom,
    // so we relax them for the 3D layer only — DOM/React code keeps them on.
    files: ['src/3d/**/*.{js,jsx}', 'src/scenes/**/*.{js,jsx}'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
])
