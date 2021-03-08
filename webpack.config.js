const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
    entry: {
        'build/bundle': ['./src/demo'],
        'build/official-samples': ['./src/demo/official-samples'],
    },
    resolve: {
        alias: {
            'lightweight-charts': 'lightweight-charts/dist/lightweight-charts.esm.development.js',
            'svelte-lightweight-charts': path.resolve(__dirname,'./src/package/dist'),
        },
        extensions: ['.mjs', '.js', '.ts', '.svelte'],
    },
    output: {
        path: path.join(__dirname, '/public'),
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
                exclude: /node_modules/
            },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        compilerOptions: {
                            dev: !prod
                        },
                        emitCss: prod,
                        hotReload: !prod,
                        preprocess: sveltePreprocess({sourceMap: !prod})
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                // required to prevent errors from Svelte on Webpack 5+
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },
    mode,
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configOverwrite: {
                    skipLibCheck: false,
                }
            }
        }),
    ],
    devtool: prod ? false : 'source-map',
    devServer: {
        hot: false
    }
};
