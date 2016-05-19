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
var browserSync = require('browser-sync').create();

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
        .pipe(gulp.dest('www/css/'))
        .pipe(browserSync.stream());
});
gulp.task('w', ['sass'], function () {
    gulp.watch("scss/**/*.scss", ['sass'])
});

gulp.task('iconfont', function () {
    return gulp.src(['iconfont/svg/*.svg'])
        .pipe(iconfontCss({
            fontName: "iconfont",
            path: 'iconfont/templates/_icons._scss',
            targetPath: '../../scss/_icons.scss',
            fontPath: '../fonts/'
        }))
        .pipe(iconfont({
            fontName: 'iconfont',
            formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
        }))
        .pipe(gulp.dest('www/fonts/'));
});
gulp.task('default', ["iconfont", "sass"]);

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./www"
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("www/**/*.html").on('change', browserSync.reload);
    gulp.watch("www/**/*.js").on('change', browserSync.reload);
});