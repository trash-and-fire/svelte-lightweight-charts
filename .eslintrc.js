function typescriptRules() {
    return {
        "no-console": "error",
        "@typescript-eslint/ban-types": [
            "error",
            {
                extendDefaults: false,
                types: {
                    String: {
                        message: 'Use string instead',
                        fixWith: 'string',
                    },
                    Boolean: {
                        message: 'Use boolean instead',
                        fixWith: 'boolean',
                    },
                    Number: {
                        message: 'Use number instead',
                        fixWith: 'number',
                    },
                    Symbol: {
                        message: 'Use symbol instead',
                        fixWith: 'symbol',
                    },

                    Function: {
                        message: [
                            'The `Function` type accepts any function-like value.',
                            'It provides no type safety when calling the function, which can be a common source of bugs.',
                            'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
                            'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
                        ].join('\n'),
                    },

                    // object typing
                    Object: {
                        message: [
                            'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
                            '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
                            '- If you want a type meaning "any value", you probably want `unknown` instead.',
                        ].join('\n'),
                    },
                }
            }
        ],
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
    };
}

module.exports = {
    root: true,
    overrides: [
        {
            extends: [
                "eslint:recommended",
                "plugin:node/recommended"
            ],
            files: ['.eslintrc.js', 'webpack.config.js', 'gulpfile.js', 'repl-maker.js', 'scripts/**/*.(js|cjs)'],
            parserOptions: {
                "ecmaVersion": 2017
            },
            env: {
                node: true,
                browser: false,
                es6: true
            },
            rules: {
                "node/no-unpublished-require": "off",
                "node/no-unpublished-import": "off",
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
            rules: typescriptRules(),
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
            rules: typescriptRules(),
            settings: {
                'svelte3/typescript': require('typescript'),
            }
        }
    ]
};
