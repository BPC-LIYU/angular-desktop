var gulp = require('gulp');
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
// var less = require('gulp-less');
var sass = require('gulp-sass');
var iconfont = require('gulp-iconfont');
var sourcemaps = require('gulp-sourcemaps');
var iconfontCss = require('gulp-iconfont-css');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

var autoprefixerOptions = {
    browsers: [
        'last 2 versions',
        'iOS >= 7',
        'Android >= 4',
        'Explorer >= 10',
        'ExplorerMobile >= 11'
    ],
    cascade: false
};
gulp.task('sass', function () {
    gulp.src('scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('www/css/'));
});
gulp.task('w', ['sass'], function () {
    gulp.watch("scss/**/*.scss", ['sass'])
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