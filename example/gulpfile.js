'use strict';
var gulp = require('gulp');

gulp.task('htmlhint', function() {
  var htmlhint = require('gulp-htmlhint');
  var htmlhintJunitReporter = require('gulp-htmlhint-junit-reporter');
  gulp.src(['index.html'])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter(htmlhintJunitReporter('TEST-htmlhint.xml')));
});
