import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pluginImport from 'eslint-plugin-import';
import pluginTailwindcss from 'eslint-plugin-tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname
});

export default [
  {
    ignores: ['node_modules', '.next', 'dist', 'coverage', 'playwright-report', '.turbo', '.vercel']
  },
  ...compat.extends('next/core-web-vitals', 'plugin:tailwindcss/recommended', 'prettier'),
  {
    files: ['app/**/*.{js,jsx,ts,tsx}', 'src/**/*.{js,jsx,ts,tsx}', 'tests/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: pluginImport,
      tailwindcss: pluginTailwindcss
    },
    settings: {
      'import/resolver': {
        typescript: {}
      }
    },
    rules: {
      'import/no-default-export': 'error',
      'import/no-anonymous-default-export': 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      'tailwindcss/no-custom-classname': 'off'
    }
  },
  {
    files: [
      'app/**/page.tsx',
      'app/**/layout.tsx',
      'app/**/template.tsx',
      'app/**/error.tsx',
      'app/**/loading.tsx',
      'app/**/route.ts',
      'app/**/route.tsx'
    ],
    rules: {
      'import/no-default-export': 'off'
    }
  },
  {
    files: ['**/*.config.{js,cjs,mjs,ts}'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  }
];
