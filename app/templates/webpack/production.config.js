'use strict';

var _                   = require('lodash');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var defaultConfig       = require('./default.config');
var webpack             = require('webpack');

module.exports = _.merge(defaultConfig, {
  devtool: false,
  output: {
    path: './public/assets',
    publicPath: '/assets/',
    filename: '[name]-[chunkhash].bundle.js',
    chunkFilename: '[id]-[chunkhash].bundle.js'
  },
  plugins: [
    /*new webpack.optimize.CommonsChunkPlugin('common', 'common-[chunkhash].bundle.js'),*/ // Code splitting
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"', '__DEV__': false }),
    new ChunkManifestPlugin({
      filename: 'webpack-common-manifest.json',
      manfiestVariable: 'webpackBundleManifest'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}, function(obj1, obj2) {
  return _.isArray(obj2) ? obj2.concat(obj1) : undefined;
});
