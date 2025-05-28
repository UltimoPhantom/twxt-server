module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'no-console': 'off', // Changed from 'warn' to 'off' to avoid console warnings
    'no-unused-vars': ['error', { 
      'vars': 'all', 
      'args': 'after-used', 
      'ignoreRestSiblings': true,
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }]
  },
  // More specific overrides for test files
  overrides: [
    {
      files: ['__tests__/**/*.js', '**/*.test.js'],
      rules: {
        'no-unused-vars': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/order': 'off',
        'import/first': 'off',
        'import/newline-after-import': 'off',
        'consistent-return': 'off',
        'func-names': 'off',
        'prefer-destructuring': 'off',
        'no-await-in-loop': 'off',
        'guard-for-in': 'off',
        'no-restricted-syntax': 'off',
        'import/prefer-default-export': 'off'
      }
    }
  ],
};
