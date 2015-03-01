'use strict';

var _             = require('lodash'),
    defaultConfig = require('./default.config'),
    webpack       = require('webpack');

module.exports = _.merge(defaultConfig, {
  /*entry: {
    main: [
      'webpack-dev-server/client?http://localhost:8080/assets/',
      'webpack/hot/only-dev-server'
    ]
  },*/
  cache: true,
  debug: true,
  outputPathinfo: true,
  devtool: '#inline-source-map',
  plugins: [
    // Hot module replacement
    //new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin(),
    //new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js'),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"', '__DEV__': true })
  ]
}, function(obj1, obj2) {
  // concats plugins
  if (_.isArray(obj1) && _.isArray(obj2)) { return obj1.concat(obj2); }
  // push entry into array for react hot dev
  if (_.isString(obj1) && _.isArray(obj2)) { obj2.push(obj1); return obj2; }
});
