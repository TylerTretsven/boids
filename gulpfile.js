var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
  return browserify('./boids/src/simulation.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./boids/'));
});

gulp.task('default', ['browserify']);
