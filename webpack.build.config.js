const path = require('path');
const webpack = require('webpack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const os = require('os');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/index')
    },

    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        library: 'ReactAreaLinkage',
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    },

    // fix: https://stackoverflow.com/questions/38053561/only-a-reactowner-can-have-refs-you-might-be-adding-a-ref-to-a-component-that-w
    externals: [{
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    }, {
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        }
    }],

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.join(__dirname, './node_modules')],
        alias: {
            '@src': path.resolve(__dirname, './src')
        }
    },

    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css'
        }),

        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            },
            cssProcessor: require('cssnano'),
            assetNameRegExp: /\.less|\.css$/g
        }),
        
        new ParallelUglifyPlugin({
            workerCount: os.cpus().length,
            cacheDir: '.cache/',
            sourceMap: false,
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            mangle: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
