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
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            "allowExpressions": true,
          }
        ],
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/typedef": [
          "error",
          {
            arrowParameter: true,
            memberVariableDeclaration: true,
            parameter: true,
            propertyDeclaration: true,
          }
        ],
      },
    },
    {
      parser: '@typescript-eslint/parser',
      plugins: [
        'svelte3',
        '@typescript-eslint',
      ],
      processor: 'svelte3/svelte3',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['**/*.svelte'],
      env: {
        browser: true,
        node: false
      },
      rules: {
        "no-console": "error",
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            "allowExpressions": true,
          }
        ],
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/typedef": [
          "error",
          {
            arrowParameter: true,
            memberVariableDeclaration: true,
            parameter: true,
            propertyDeclaration: true,
          }
        ],
      },
      settings: {
        'svelte3/typescript': require('typescript'),
      }
    }
  ]
};
