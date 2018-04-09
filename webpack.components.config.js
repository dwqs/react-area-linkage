const path = require('path');
const webpack = require('webpack');

const Components = require('./components.json');

module.exports = {
    entry: Components,
    output: {
        path: path.join(__dirname, './dist/lib'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },

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
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
