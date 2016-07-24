'use strict';

const _ = require('lodash');
const path = require('path');
const ROOT = path.join(__dirname, './../../');
const config = require('./config.json');
const cssnext = require('postcss-cssnext');
const webpack = require('webpack');
const developmentConfig = require('./default.config');

_.mergeWith(developmentConfig, {
  output: {
    publicPath: 'http://localhost:8080/assets/build/',
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  cache: true,
  debug: true,
  outputPathinfo: true,
  devtool: 'source-map',
  devServer: {
    contentBase: ROOT,
    hot: true,
    inline: true,
  },
  postcss() {
    return [cssnext()];
  },
}, (obj1, obj2) =>
  _.isArray(obj2) ? obj2.concat(obj1) : undefined
);

developmentConfig.module.loaders.push(
  {
    test: /\.css$/,
    loader: `style!css${config.cssModules}!postcss`,
  },
  {
    test: /\.less$/,
    loader: `style!css${config.cssModules}!postcss!less`,
  },
  {
    test: /\.scss$/,
    loader: `style!css${config.cssModules}!postcss!sass`,
  }
);

developmentConfig.plugins.push(
  // new webpack.optimize.CommonsChunkPlugin('common', 'common.js'), // Code splitting
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': "'development'",
    __DEV__: true,
  }),
  new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin() // Hot Module Replacement
);

module.exports = developmentConfig;
