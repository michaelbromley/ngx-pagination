'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const ngtools = require('@ngtools/webpack');

module.exports = function (env) {
    const aotMode = env && env.aot !== undefined;
    const prodMode = aotMode || env && env.prod !== undefined;
    const entryFile = aotMode ? 'bootstrap.aot.ts' : 'bootstrap.ts';
    const outPath = prodMode ? 'dist' : 'build';
    const devtool = prodMode ? 'source-map' : 'eval-source-map';
    const srcPath = path.join(__dirname, 'src');

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
                    loaders: aotMode ? ['@ngtools/webpack'] : [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: 'tsconfig.docs.json'
                            }
                        },
                        {
                            loader: 'angular2-template-loader',
                            options: {
                                formatRequire(url) {
                                    if (url.match(/\.scss$/)) return `require('${url}')`;
                                    else if (url.match(/\.html$/)) return `require('${url}').default`;
                                }
                            }
                        }
                    ]
                },
                {test: /\.css/, loader: 'raw-loader'},
                {test: /\.scss/, loader: 'raw-loader!sass-loader'},
                {test: /\.html/, loader: 'raw-loader'}
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: prodMode
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
        devtool: devtool,
        mode: prodMode ? 'production' : 'development',
        optimization: prodMode ? {
            minimizer: [new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            })]
        } : undefined,
    };

    return config;
};
