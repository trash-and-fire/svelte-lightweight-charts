module.exports = {
  root: true,
  overrides: [
    {
      extends: [
          "eslint:recommended",
          "plugin:node/recommended"
      ],
      files: ['.eslintrc.js', 'webpack.config.js'],
      env: {
        node: true,
        browser: false
      },
      rules: {
        "node/no-unpublished-require": "off",
      }
    },
    {
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint',
      ],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['**/*.ts'],
      env: {
        browser: true,
        node: false
      },
      rules: {
        "no-console": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/typedef": [
          "error",
          {
              arrowParameter: true,
              memberVariableDeclaration: true,
              parameter: true,
              propertyDeclaration: true,
          }
        ],
      }
    },
    {
      plugins: ['svelte3'],
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    }
  ]
};
