/*=============================================
 =            Gulp Starter by @dope            =
 =============================================*/

/**
 *
 * The packages we are using
 * Not using gulp-load-plugins as it is nice to see whats here.
 *
 **/
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    javascriptObfuscator = require('gulp-javascript-obfuscator'),
    cleanCSS = require('gulp-clean-css'),
    notify = require("gulp-notify"),
    phpinc = require("php-include-html"),
    php2html = require("gulp-php2html"),
    htmlmin = require('gulp-minify-html'),
    rimraf = require('rimraf'),
    beautifyCode = require('gulp-beautify-code'),
    zip = require('gulp-zip'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    imagemin = require('gulp-imagemin'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    prettyHtml = require('gulp-pretty-html'),
    babel = require('gulp-babel');
/**
 *
 * Styles
 * - Compile
 * - Compress/Minify
 * - Autoprefixer
 *
 **/

gulp.task('sass', function () {
    gulp.src('assets/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: true
        }))
        .pipe(concat('bootstrap.css'))
        .pipe(notify("Found file: <%= file.relative %>!"))
        .pipe(gulp.dest('assets/css/'))
});

gulp.task('sass2', function () {
    gulp.src('assets/scss/theme-scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: true
        }))
        .pipe(concat('style.css'))
        .pipe(notify("Found file: <%= file.relative %>!"))
        .pipe(gulp.dest('assets/css/'))
});

gulp.task('js', function () {
    gulp.src('assets/js/main-js/*.js')
        .pipe(concat("scripts.js"))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(notify("Found file: <%= file.relative %>!"))
        .pipe(gulp.dest('./assets/js'))
});

gulp.task('watch2', function () {
    gulp.watch('assets/scss/**/*.scss', ['sass2']);
    // gulp.watch('assets/js/main-js/*.js', ['js']).on("change", reload);
    // browserSync.init({
    //     server: {
    //         baseDir: "./"
    //     }
    // });
});


//Only use for production site
gulp.task('watch', function () {
    gulp.watch('assets/scss/**/*.scss', ['sass']);
    // gulp.watch('assets/js/main-js/*.js', ['js']).on("change", reload);
    // browserSync.init({
    //     server: {
    //         baseDir: "./"
    //     }
    // });
});

// Clean Build Folder
gulp.task('clean:review', function (cb) {
    rimraf('./dist/review', cb);
});


gulp.task('css:review:build', function () {
    return gulp.src('./assets/css/*.css')
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/review/assets/css'))
});

gulp.task('html:review:build', function () {
    return gulp.src('./*.html')
        .pipe(prettyHtml())
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/review'));
});

gulp.task('fonts:review:build', function () {
    return gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./dist/review/assets/fonts'));
});

gulp.task('js:review:build', function () {
    gulp.src('./assets/js/*.js')
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/review/assets/js'))
});

gulp.task('js:review:uglify:build', function () {
    gulp.src('./dist/review/assets/js/*')
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/review/assets/js'))
});

gulp.task('images:review:build', function () {
    gulp.src('./assets/images/**/*')
        .pipe(gulp.dest('./dist/review/assets/images'))
});

gulp.task('others:review:build', function () {
    gulp.src(['./favicon.ico', './apple-touch-icon.png', './gulpfile.js', './package.json', './package-lock.json'])
        .pipe(gulp.dest('./dist/review/'))
});

gulp.task('review:zip', function () {
    gulp.src('dist/review/**')
        .pipe(zip('review.zip'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('contact:review:build', function () {
    gulp.src('./assets/contact-form/**/*')
        .pipe(gulp.dest('./dist/review/assets/contact-form'))
});

gulp.task('downloads:review:build', function () {
    gulp.src('./assets/downloads/**/*')
        .pipe(gulp.dest('./dist/review/assets/downloads'))
});

gulp.task('scss:review:build', function () {
    gulp.src('./assets/scss/**/*')
        .pipe(gulp.dest('./dist/review/assets/scss'))
});

gulp.task('build:review', function () {
    runSequence(
        'css:review:build',
        'html:review:build',
        'fonts:review:build',
        'js:review:build',
        'images:review:build',
        'others:review:build',
        'contact:review:build',
        'downloads:review:build',
        'scss:review:build',
        // 'review:zip'
    )
});


// production task
// Clean Build Folder
gulp.task('clean:prod', function (cb) {
    rimraf('./dist/prod', cb);
});


gulp.task('css:prod:build', function () {
    return gulp.src('./assets/css/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/prod/assets/css'))
});

gulp.task('html:prod:build', function () {
    return gulp.src('./*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/prod'));
});

gulp.task('fonts:prod:build', function () {
    return gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./dist/prod/assets/fonts'));
});

gulp.task('js:prod:build', function () {
    gulp.src('./assets/js/*.js')
        .pipe(javascriptObfuscator())
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/prod/assets/js'))
});

gulp.task('js:prod:uglify:build', function () {
    gulp.src('./dist/prod/assets/js/*')
        .pipe(uglify())
        .pipe(beautifyCode({
            indent_size: 4,
            indent_char: ' ',
        }))
        .pipe(gulp.dest('./dist/prod/assets/js'))
});

gulp.task('images:prod:build', function () {
    gulp.src('./assets/images/**/*')
        .pipe(gulp.dest('./dist/prod/assets/images'))
});

gulp.task('others:prod:build', function () {
    gulp.src(['./favicon.ico', './apple-touch-icon.png'])
        .pipe(gulp.dest('./dist/prod/'))
});

gulp.task('review:zip', function () {
    gulp.src('dist/prod/**')
        .pipe(zip('review.zip'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('contact:prod:build', function () {
    gulp.src('./assets/contact-form/**/*')
        .pipe(gulp.dest('./dist/prod/assets/contact-form'))
});

gulp.task('downloads:prod:build', function () {
    gulp.src('./assets/downloads/**/*')
        .pipe(gulp.dest('./dist/prod/assets/downloads'))
});

gulp.task('combine:prod:build', function () {
    return gulp.src('./*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', javascriptObfuscator()))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulp.dest('./dist/prod/'));
});

gulp.task('build:prod', function () {
    runSequence(
        'css:prod:build',
        // 'html:prod:build',
        'fonts:prod:build',
        'js:prod:build',
        'images:prod:build',
        'others:prod:build',
        'contact:prod:build',
        'downloads:prod:build',
        'combine:prod:build',
        // 'review:zip'
    )
});