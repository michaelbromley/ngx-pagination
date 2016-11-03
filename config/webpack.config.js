'use strict';

const webpack = require('webpack');
const path = require('path');
const ngtools = require('@ngtools/webpack');

module.exports = function (env) {
    const aotMode = env && env.aot !== undefined;
    const prodMode = aotMode || env && env.prod !== undefined;
    const entryFile = aotMode ? 'bootstrap.aot.ts' : 'bootstrap.ts';
    const outPath = prodMode ? 'dist' : 'build';
    const devtool = prodMode ? 'source-map' : 'eval-source-map';
    const srcPath = path.join(__dirname, '..', 'docs', 'src');

    let config = {
        target: 'web',
        cache: true,
        entry: {
            app: path.join(srcPath, entryFile),
            common: [
                'es6-shim/es6-shim',
                'reflect-metadata/Reflect.js',
                'zone.js/dist/zone.js'
            ]
        },
        resolve: {
            extensions: ['.js', '.ts'],
            modules: ['node_modules'],
            alias: {}
        },
        output: {
            path: path.join(__dirname, '..', 'docs', outPath),
            publicPath: '',
            filename: '[name].js',
            pathinfo: true
        },
        module: {
            noParse: [],
            loaders: [
                {
                    test: /\.ts$/,
                    loaders: aotMode ? ['@ngtools/webpack'] : ['ts-loader?configFileName=config/tsconfig.demo.json', 'angular2-template-loader']
                },
                {test: /\.css/, loader: 'raw'},
                {test: /\.json/, loader: 'json'},
                {test: /\.scss/, loader: 'raw!sass'},
                {test: /\.html/, loader: 'raw'}
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                test: /\.ts$/,
                options: {
                    resolve: {}
                }
            }),
            new webpack.DefinePlugin({
                PRODUCTION: prodMode
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: 'common.js',
                minChunks: Infinity
            }),
            new webpack.NoErrorsPlugin()
        ],
        devtool: devtool
    };
    if (aotMode) {
        config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
        config.plugins.push(new ngtools.AotPlugin({
            tsConfigPath: './config/tsconfig.demo.aot.json',
            entryModule: path.resolve(__dirname, '..', 'docs/src/demo.module#DemoModule'),
            baseDir: path.resolve(__dirname, '..'),
            genDir: path.resolve(__dirname, '..', './docs/ngfactory')
        }));
    }

    return config;
};
