/**
 * Created by thiron on 29/06/2015.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');

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
  return tsResult.js.pipe(gulp.dest('./js'));
});