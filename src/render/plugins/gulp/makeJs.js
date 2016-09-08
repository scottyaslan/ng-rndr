var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('makeJs', function() {
    
    gulp.src('./src/*.js')
        //compile to js (and create map files)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../../../dist/plugins'))
        
        //minify js files as well
        .pipe(filter('*.js'))//filter, to avoid doing this processing on the map files generated above 
         .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.init({loadMaps: true}))//load the source maps generated in the first step
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../../../dist/plugins'));
});

