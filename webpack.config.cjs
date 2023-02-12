const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
    entry: {
        'index': ['./src/demo'],
        'official-samples': ['./src/demo/official-samples'],
    },
    resolve: {
        alias: Object.assign({
            'svelte-lightweight-charts': path.resolve(__dirname, './dist'),
        }),
        extensions: ['.mjs', '.js', '.ts', '.svelte'],
    },
    output: {
        path: path.join(__dirname, '/public'),
        filename: prod ? '[name].[contenthash].js' : '[name].js',
        chunkFilename: prod ? '[name].[id].[contenthash].js' : '[name].[id].js'
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
            filename: prod ? '[name].[contenthash].css' : '[name].css'
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configOverwrite: {
                    skipLibCheck: false,
                }
            }
        }),
        new HtmlWebpackPlugin({
            chunks: ['runtime', 'vendors', 'index'],
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['runtime', 'vendors', 'official-samples'],
            filename: 'official-samples.html',
        })
    ],
    devtool: prod ? false : 'source-map',
    devServer: {
        hot: false
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};
