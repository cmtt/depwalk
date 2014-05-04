var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');

gulp.task('jshint', function () {
  return gulp
    .src(['index.js', 'gulpfile.js','lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// gulp.task('mocha', function () {
//   var mochaOptions = {};
//   return gulp
//     .src(['contrib/test-helper.js','test/**/*.js'])
//     .pipe(mocha(mochaOptions));
// });

gulp.task('nodemon', function (cb) {
  var nodemonOptions = {
    script: 'index.js',
    watch : ['index.js', 'lib/**/*.js','test/**/*.js'],
    ext: 'js',
    ignore: [
      'node_modules/**/*'
    ]
  };
  nodemon(nodemonOptions)
    .on('change', ['jshint']);
    cb(null);
});

gulp.task('default', ['nodemon']);
