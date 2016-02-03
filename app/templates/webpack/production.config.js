'use strict';

const _ = require('lodash');
const config = require('./config.json');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const productionConfig = require('./default.config');

_.mergeWith(productionConfig, {
  devtool: false,
  output: {
    path: './public/assets',
    publicPath: '/assets/',
    filename: '[name]-[chunkhash].bundle.js',
    chunkFilename: '[id]-[chunkhash].bundle.js'
  },
  postcss() {
    return [cssnext(), cssnano];
  }
}, (obj1, obj2) =>
  _.isArray(obj2) ? obj2.concat(obj1) : undefined
);

productionConfig.module.loaders.push(
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', `css${config.cssModules}!postcss`)
  },
  {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style', `css${config.cssModules}!postcss!less`)
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style', `css${config.cssModules}!postcss!sass`)
  }
);

productionConfig.plugins.push(
  // new webpack.optimize.CommonsChunkPlugin('common', 'common-[chunkhash].bundle.js'), // Code splitting
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': "'production'",
    __DEV__: false
  }),
  new ExtractTextPlugin('[name]-[contenthash].css'),
  new ManifestPlugin({
    fileName: 'webpack-asset-manifest.json'
  }),
  new ChunkManifestPlugin({
    filename: 'webpack-common-manifest.json',
    manfiestVariable: 'webpackBundleManifest'
  }),
  new webpack.optimize.UglifyJsPlugin()
);

module.exports = productionConfig;
