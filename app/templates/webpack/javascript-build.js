const config = require('./config.json');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const env = require('gulp-env');
const webpack = require('webpack');

const cleanTask = (files) => () => {
  del(files, (err, paths) => {
    gutil.log('Deleted files/folders:\n', gutil.colors.cyan(paths.join('\n')));
  });
};

gulp.task('clean', cleanTask([`.${config.path.build}`]));

gulp.task('build', ['clean', 'set-production-env'], (cb) => {
  let started = false;

  webpack(require('./production.config.js')).run((err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({ colors: true }));

    if (!started) {
      started = true;
      cb();
    }
  });
});

gulp.task('set-production-env', () => {
  env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});
