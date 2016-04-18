var gulp = require('gulp');
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var less = require('gulp-less');
var iconfont = require('gulp-iconfont');
var sourcemaps = require('gulp-sourcemaps');
var iconfontCss = require('gulp-iconfont-css');
var concat = require('gulp-concat');


gulp.task('less', function () {
    gulp.src('less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('less_all.css'))
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('www/css/'));
});
gulp.task('w', ['less'], function () {
    gulp.watch("less/**/*.less", ['less'])
});

gulp.task('iconfont', function () {
    return gulp.src(['iconfont/svg/*.svg'])
        .pipe(iconfontCss({
            fontName: "iconfont",
            path: 'iconfont/templates/_icons._css',
            targetPath: '../css/icons.css',
            fontPath: '../fonts/'
        }))
        .pipe(iconfont({
            fontName: 'iconfont',
            formats: ['ttf', 'eot', 'woff', 'svg', 'woff2']
        }))
        .pipe(gulp.dest('www/fonts/'));
});
gulp.task('default', ["iconfont", "less"]);