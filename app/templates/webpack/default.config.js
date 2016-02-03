'use strict';

const path = require('path');
const ROOT = path.join(__dirname, './../../');
const config = require('./config.json');
const webpack = require('webpack');

module.exports = {
  context: ROOT,
  entry: {
    main: [
      path.join(ROOT, config.webpack.path, 'main')
    ]
  },
  output: {
    path: config.webpack.build
  },
  externals: [],
  resolve: {
    modulesDirectories: ['node_modules', 'vendor/assets/bower_components'],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        // exclude: /node_modules(?!.*(\/js-csp))/, // ignore node_modules except node_modules/js-csp
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg|ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    ])
  ]
};
