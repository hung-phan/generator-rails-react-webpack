/*
 * @author Hung Quang Phan
 *
 * Development config
 */

const config = require('./config.json');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const env = require('gulp-env');
const webpack = require('webpack');

// clean task
gulp.task('javascript:clean', () => {
  del([config.webpack.build], (err, paths) => {
    gutil.log(
      'Deleted files/folders:\n',
      gutil.colors.cyan(paths.join('\n'))
    );
  });
});

// build task
gulp.task('javascript:build', ['javascript:clean', 'set-production-env'], (cb) => {
  let started = false;
  const bundler = webpack(require('./production.config.js'));
  const bundle = (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({ colors: true }));
    if (!started) {
      started = true;
      cb();
    }
  };

  bundler.run(bundle);
});

gulp.task('set-production-env', () => {
  env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});
