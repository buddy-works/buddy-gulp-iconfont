var gulp = require('gulp'),
    consolidate = require('gulp-consolidate'),
    iconfont = require('gulp-iconfont');


gulp.task('iconfont', function () {
    return gulp.src('assets/iconfont-src/*.svg')
        .pipe(iconfont({
            fontName: 'iconfont',
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            appendCodepoints: true,
            appendUnicode: false,
            normalize: true,
            fontHeight: 1000,
            centerHorizontally: true
        }))
        .on('glyphs', function (glyphs, options) {
            console.log(glyphs);

            gulp.src('assets/iconfont-src/_iconfont.scss')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: 'iconfont',
                    fontPath: '../iconfont/',
                    className: 'icon',
                    fontDate: new Date().getTime()
                }))
                .pipe(gulp.dest('assets/scss'));
        })
        .pipe(gulp.dest('assets/iconfont'));
});