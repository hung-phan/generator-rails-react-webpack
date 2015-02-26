/*
 * @author Hung Quang Phan
 *
 * Development config
 */

var _             = require('lodash'),
    config        = require('./config.json'),
    del           = require('del'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    plumber       = require('gulp-plumber'),
    transform     = require('vinyl-transform'),
    browserify    = require('browserify'),
    watchify      = require('watchify'),
    babelify      = require('babelify'),
    envify        = require('envify/custom'),
    shimify       = require('browserify-shim'),
    minimist      = require('minimist'),
    errorsHandler = require('./errors-handler');

// clean task
gulp.task('javascript:clean', function () {
  del([config.browserify.build], function (err, paths) {
    gutil.log(
      'Deleted files/folders:\n',
      gutil.colors.cyan(paths.join('\n'))
    );
  });
});

// watch task
gulp.task('javascript:dev', function () {
  var bundle,
      bundler,
      cached = {},
      argv = minimist(process.argv.slice(2)),
      source = argv.only ? config.browserify.path + argv.only : config.browserify.src;

  bundler = function() {
    return transform(function(filename) {
      // cached
      if (cached[filename]) {
        return cached[filename].bundle();
      }

      var b = watchify(browserify(filename, _.extend({
                runtime: require.resolve('regenerator/runtime'),
                debug: true
              }, watchify.args)));

      b.on('time', function(time) {
        gutil.log(gutil.colors.green('Bundle'), filename + gutil.colors.magenta(' in ' + time + 'ms'));
      });
      b.on('error', errorsHandler.browserifyErrorHandler);
      b.on('update', bundle);
      b.transform(babelify);
      b.transform(shimify);
      b.transform(envify({
        NODE_ENV: 'development'
      }));

      cached[filename] = b;

      return b.bundle();
    });
  };

  bundle = function() {
    var stream = gulp.src([source])
                   .pipe(plumber({ errorHandler: errorsHandler.browserifyErrorHandler }))
                   .pipe(bundler())
                   .pipe(gulp.dest(config.browserify.build));

    return stream;
  };

  return bundle();
});

// build task
gulp.task('javascript:build', ['javascript:clean'], function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename, {
              runtime: require.resolve('regenerator/runtime')
            });

    b.on('error', errorsHandler.browserifyErrorHandler);
    b.on('time', function(time) {
      gutil.log(gutil.colors.green('Bundle'), filename + gutil.colors.magenta(' in ' + time + 'ms'));
    });
    b.transform(babelify);
    b.transform(shimify);
    b.transform(envify({
      NODE_ENV: 'production'
    }));

    return b.bundle();
  });

  var stream = gulp.src([config.browserify.src])
                 .pipe(plumber({ errorHandler: errorsHandler.browserifyErrorHandler }))
                 .pipe(browserified)
                 .pipe(gulp.dest(config.browserify.build));

  return stream;
});
