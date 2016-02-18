'use strict';

var webpack = require('webpack');
var path = require('path');
var srcPath = path.join(__dirname, 'demo', 'src');

var config = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(srcPath, 'demo-app.ts'),
        common: [
            'angular2/bundles/angular2-polyfills'
        ]
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['node_modules'],
        alias: {}
    },
    output: {
        path: path.join(__dirname, 'demo', 'build'),
        publicPath: '',
        filename: '[name].js',
        pathInfo: true
    },

    module: {
        noParse: [],
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts'
            },
            { test: /\.css$/, loader: 'style!raw' },
            { test: /\.html/, loader: 'html' }
        ]
    },
    ts: {
        configFileName: 'tsconfig.demo.json'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js',
            minChunks: Infinity
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false
        })
    ],
    debug: true,
    devtool: 'cheap-source-map'
};

module.exports = config;