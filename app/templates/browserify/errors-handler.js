var gutil    = require('gulp-util'),
    notifier = require('node-notifier');

module.exports = {
  browserifyErrorHandler: function (err) {
    notifier.notify({ message: 'Error: ' + err.message });
    gutil.log(gutil.colors.red('Error'), err.message);
    this.emit('end');
  }
};
