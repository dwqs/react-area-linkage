/**
 * Created by pomy on 20/07/2017.
 */

let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

let config = require('../config');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[ext]?[hash:8]'
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[ext]?[hash:8]'
                    }
                }]
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.join(__dirname, '../node_modules')],
        alias: {
            '@gh': path.resolve(__dirname, '../gh'),
            '@components': path.resolve(__dirname, '../gh/components')
        }
    },

    resolveLoader: {
        modules: [path.join(__dirname, '../node_modules')]
    },

    performance: {
        hints: false
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'tpl.html',
            inject: true,
            env: process.env.NODE_ENV,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
            }
        })
    ]
};
