/**
 * Created by thiron on 29/06/2015.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

/**
 * Par défaut, on watch
 */
gulp.task('default', ['watch', 'typescript']);

/**
 * Watchers
 */
gulp.task('watch', function ()
{
  gulp.watch("./ts/**/*.ts", ['typescript']);
});

/**
 * TypeScript
 */
gulp.task('typescript', function ()
{
  var tsResult = gulp.src('./ts/**/*.ts')
    .pipe(ts({
      noImplicitAny: true,
      out: 'main.js',
      target: 'ES6'
    }));
  return tsResult.js.pipe(gulp.dest('./docs'));
});

/**
 * Minify
 */
gulp.task('minify', function ()
{
  return gulp.src('./docs/main.js')
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./docs'));
});