var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css');

gulp.task('makeCss', function() {
    gulp.src('./src/render/plugins/pivot.css')
        .pipe(concat('pivot.css'))//trick to output to new file
        .pipe(gulp.dest('./dist/css'))
        .pipe(minifyCSS())
        .pipe(concat('pivot.min.css'))//trick to output to new file
        .pipe(gulp.dest('./dist/css'))
});
