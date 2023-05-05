const path = require('path')
const webpack = require("webpack");
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const { WebpackPluginServe } = require('webpack-plugin-serve')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const { EsbuildPlugin } = require('esbuild-loader')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const sveltePreprocess = require("svelte-preprocess");

exports.devServer = () => ({
    watch: true,
    plugins: [
        new WebpackPluginServe({
            port: 5000,
            static: path.resolve(process.cwd(), 'dist'),
            historyFallback: true
        })
    ]
})

exports.page = ({ title }) => ({
    plugins: [new MiniHtmlWebpackPlugin({ publicPath: '/', context: { title } })]
})

exports.generateSourceMaps = ({ type }) => ({ devtool: type })

exports.static = () => ({
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        })
    ]
})

exports.svelte = mode => {
    const prod = mode === 'production'

    return {
        resolve: {
            alias: {
                svelte: path.dirname(require.resolve('svelte/package.json')),
                src: path.resolve(__dirname, "src"),
                libs: path.resolve(__dirname, "libs")
            },
            extensions: [".mjs", ".tsx", ".ts", ".js", ".svelte", ".svx"],
            mainFields: ["svelte", "browser", "module", "main"],
            conditionNames: ["svelte", "module", "browser"]
        },
        module: {
            rules: [
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
                            preprocess: sveltePreprocess({
                                postcss: true,
                            }),
                        }
                    }
                },
                {
                    test: /node_modules\/svelte\/.*\.mjs$/,
                    resolve: {
                        fullySpecified: false
                    }
                }
            ]
        }
    }
}

exports.typescript = () => ({
    module: { rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }] }
})

exports.postcss = () => ({
    loader: 'postcss-loader'
})

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [{ loader: MiniCssExtractPlugin.loader, options }, 'css-loader'].concat(
                        loaders
                    ),
                    sideEffects: true
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ]
    }
}

exports.loadSvg = () => ({
    module: { rules: [{ test: /\.svg$/, type: 'asset' }] }
})

exports.useDotenv = () => ({
    plugins: [new DotenvPlugin()]
})

exports.esbuild = () => {
    return {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'esbuild-loader',
                    options: {
                        target: 'es2015'
                    }
                },
                {
                    test: /\.ts$/,
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'ts',
                        target: 'es2015'
                    }
                }
            ]
        },
        plugins: [new EsbuildPlugin()]
    }
}

exports.optimize = () => ({
    optimization: {
        minimize: true,
        splitChunks: { chunks: 'all' },
        runtimeChunk: { name: 'runtime' },
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
})

exports.analyze = () => ({
    plugins: [
        new BundleAnalyzerPlugin({
            generateStatsFile: true
        })
    ]
})

exports.polyfills = () => ({
    //...
    resolve: {
        fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            process: require.resolve('process/browser'),
            path: require.resolve('path-browserify'),
            zlib: require.resolve("browserify-zlib"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            net: false,
            url: require.resolve("url"),
            util: require.resolve("util"),
            fs: require.resolve("browserify-fs"),
            async_hooks: false
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"]
        })
    ]
});
