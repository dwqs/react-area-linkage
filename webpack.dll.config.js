/**
 * Created by pomy on 19/07/2017.
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['antd', 'area-data', 'lodash.find']
    },
    output: {
        path: path.join(__dirname, './demo'),
        filename: '[name].dll.js',
        //定义输出：window.${output.library}
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, './demo', '[name]-manifest.json'),
            // 和 output.library 一样即可
            name: '[name]_library'
        })
    ]
};
