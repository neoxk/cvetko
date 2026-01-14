module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['expo', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
