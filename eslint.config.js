const config = require('@rubensworks/eslint-config');

module.exports = config([
  {
    ignores: [
      'node_modules',
      'coverage',
      '.github',
      'esm',
      '**/*.js',
      '**/*.d.ts',
      '**/*.js.map',
    ],
  },
  {
    files: [ '**/*.ts' ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [ './tsconfig.eslint.json' ],
      },
    },
  },
  {
    rules: {
      // This package is a Node.js stream utility, so importing Node.js builtins is intentional
      'import/no-nodejs-modules': 'off',
    },
  },
]);
