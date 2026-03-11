/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vitest/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['vitest'],
  env: {
    'vitest/env': true
  }
}
