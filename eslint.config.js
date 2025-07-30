import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config([
  {
    ignores: ['dist', 'node_modules', '.wrangler', 'frontend', 'ksda'],
  },
  // API files
  {
    files: ['api/**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: path.resolve(__dirname, 'api/tsconfig.json'),
        tsconfigRootDir: __dirname,
      },
    },
  },
]);