'use strict';

const webpack = require('webpack');
const path = require('path');

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
                'core-js/index.js',
                'reflect-metadata/Reflect.js',
                'zone.js/dist/zone.js'
            ]
        },
        resolve: {
            extensions: ['.js', '.ts'],
            modules: [path.join(srcPath, '../node_modules')]
        },
        output: {
            path: path.join(__dirname, '..', 'docs', outPath),
            publicPath: '',
            filename: '[name].js',
            pathinfo: true
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loaders: aotMode ? ['@ngtools/webpack'] : ['ts-loader?configFileName=config/tsconfig.docs.json', 'angular2-template-loader']
                },
                {test: /\.css/, loader: 'raw-loader'},
                {test: /\.json/, loader: 'json-loader'},
                {test: /\.scss/, loader: 'raw-loader!sass-loader'},
                {test: /\.html/, loader: 'raw-loader'}
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: prodMode
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: 'common.js',
                minChunks: Infinity
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            // Fix `Critical dependency: the request of a dependency is an expression` errors.
            // See https://github.com/angular/angular/issues/11580#issuecomment-282705332
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/,
                srcPath,
                {}
            )
        ],
        devtool: devtool
    };
    if (aotMode) {
        config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
        /*config.plugins.push(new ngtools.AotPlugin({
            tsConfigPath: './config/tsconfig.demo.aot.json',
            entryModule: path.resolve(__dirname, '..', 'docs/src/demo.module#DemoModule'),
            baseDir: path.resolve(__dirname, '..'),
            genDir: path.resolve(__dirname, '..', './docs/ngfactory')
        }));*/
    }
    if (prodMode) {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: devtool && (devtool.indexOf("sourcemap") >= 0 || devtool.indexOf("source-map") >= 0),
            comments: false
        }));
    }

    return config;
};
