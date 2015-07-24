'use strict';

var path    = require('path'),
    webpack = require('webpack'),
    config  = require('./config.json');

module.exports = {
  context: path.join(__dirname, './../../'),
  entry: {
    main: config.webpack.path + 'main'
  },
  output: {
    path: config.webpack.build,
    publicPath: '/assets/build/',
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  },
  externals: {},
  resolve: {
    modulesDirectories: ['node_modules', 'vendor/assets/bower_components'],
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /.js$/,
      //exclude: /node_modules(?!.*(\/js-csp))/, // ignore node_modules except node_modules/js-csp
      exclude: /node_modules/,
      loader: 'babel-loader?optional=runtime'
    }]
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ResolverPlugin([new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])])
  ]
};
