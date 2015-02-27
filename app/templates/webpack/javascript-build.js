/*
 * @author Hung Quang Phan
 *
 * Development config
 */

var _             = require('lodash'),
    del           = require('del'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    minimist      = require('minimist'),
    notifier      = require('node-notifier'),
    errorsHandler = require('./errors-handler');

// clean task
gulp.task('javascript:clean', function () {
  del([config.webpack.build], function (err, paths) {
    gutil.log(
      'Deleted files/folders:\n',
      gutil.colors.cyan(paths.join('\n'))
    );
  });
});

// watch task
gulp.task('javascript:dev', function () {
  var started = false,
      argv    = minimist(process.argv.slice(2)),
      config  = require('./development.config.js'),
      bundler = webpack(config),
      bundle  = function (err, stats) {
        if (err) {
          notifier.notify({ message: 'Error: ' + err.message });
          throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
        if (!started) {
          started = true;
          return cb();
        }
      }

  if (argv.watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// build task
gulp.task('javascript:build', ['javascript:clean'], function() {
  var started = false,
      argv    = minimist(process.argv.slice(2)),
      config  = require('./production.config.js'),
      bundler = webpack(config),
      bundle  = function (err, stats) {
        if (err) {
          notifier.notify({ message: 'Error: ' + err.message });
          throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
        if (!started) {
          started = true;
          return cb();
        }
      }

  bundler.run(bundle);
});
