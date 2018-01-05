# gulp-htmlhint-junit-reporter
junit reporter for gulp-htmlhint

## Background

gulp-htmlhint-junit-reporter does what you would expect from its overly-verbose
name: it is a reporter for gulp-htmlhint that outputs an xml file in junit format.

## Install

```bash
$ npm install --save-dev gulp-htmlhint-junit-reporter
```

## Usage

```javascript
var gulp = require('gulp');
var htmlhintJunitReporter = require('gulp-htmlhint-junit-reporter');
var htmlhint = require('gulp-htmlhint');
gulp.task('htmlhint', () => {
  gulp.src(['index.html'])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter(htmlhintJunitReporter('reports/TEST-htmlhint.xml')));
});
```
