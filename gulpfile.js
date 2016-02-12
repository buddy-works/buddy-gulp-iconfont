var gulp = require('gulp'),
    consolidate = require('gulp-consolidate'),
    iconfont = require('gulp-iconfont');

gulp.task('iconfont', function () {
    return gulp.src('iconfont-src/*.svg')
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

            gulp.src('iconfont-src/iconfont.css')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: 'iconfont',
                    fontPath: '',
                    className: 'icon',
                    fontDate: new Date().getTime()
                }))
                .pipe(gulp.dest('iconfont'));
        })
        .pipe(gulp.dest('iconfont'));
});