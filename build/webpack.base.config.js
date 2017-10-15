/**
 * Created by pomy on 20/07/2017.
 */

'use strict';

let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

let config = require('../config');

const env = process.env.NODE_ENV || 'development';
const apiPrefix = env === 'development' ? config.dev.prefix : config.build.prefix;

console.log('---------env------:', env, '------apiPrefix-------:', apiPrefix);

module.exports = {
    context: path.resolve(__dirname, "../src"),
    module: {
        noParse: [/static|assets/],
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

    resolve:{
        extensions:[".js",".jsx"],
        modules: [path.join(__dirname, '../node_modules')],
        alias:{
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

    externals: {
        'babel-polyfill': 'window'
    },

    plugins:[

        new webpack.DefinePlugin({
            'window.PREFIX': JSON.stringify(apiPrefix)
        }),

        //copy assets
        new CopyWebpackPlugin([
            {context: '../src', from: 'assets/**/*', to: path.resolve(__dirname, '../dist'), force: true}
        ]),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            env: process.env.NODE_ENV,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
            }
        })
    ]
}
