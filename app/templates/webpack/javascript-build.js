/*
 * @author Hung Quang Phan
 *
 * Development config
 */

var _        = require('lodash');
var config   = require('./config.json');
var del      = require('del');
var gulp     = require('gulp');
var gutil    = require('gulp-util');
var minimist = require('minimist');
var webpack  = require('webpack');
var notifier = require('node-notifier');

// clean task
gulp.task('javascript:clean', function() {
  del([config.webpack.build], function(err, paths) {
    gutil.log(
      'Deleted files/folders:\n',
      gutil.colors.cyan(paths.join('\n'))
    );
  });
});

// build task
gulp.task('javascript:build', ['javascript:clean'], function(cb) {
  var started = false,
      bundler = webpack(require('./production.config.js')),
      bundle  = function(err, stats) {
        if (err) {
          notifier.notify({ message: 'Error: ' + err.message });
          throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
        if (!started) {
          started = true;
          cb();
        }
      };

  bundler.run(bundle);
});
