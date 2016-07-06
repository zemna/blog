/**
 * Libs import
 * --> How to install? npm install --save-dev gulp-minify-html
 * @type {[type]}
 */
var gulp = require('gulp'),
    path = require('path'),
    debug = require('gulp-debug'),
// CSS
    sass = require('gulp-ruby-sass'),
    minifyCSS = require('gulp-minify-css'),

// JS BUILD
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),

// HTML
    htmlmin = require('gulp-htmlmin'),

// Browser sync
    browserSync = require('browser-sync'),

// Import files
    pkg = require('./package.json'),

// Images files
    imagemin = require('gulp-imagemin'),

// Utils
    utils = require('gulp-util'),
    options = require("minimist")(process.argv.slice(2)),
    addsrc = require('gulp-add-src'),
    spawn = require('child_process').spawn
    ;


var dist              = 'public/';
var dirPublic         = '/';
var distAssets        = './assets/';
var distStylesheets   = distAssets + 'css/';
var distJavascripts   = distAssets + 'js/';
var distImages        = distAssets + 'img/';
var distFont          = distAssets + 'fonts/';
var deploy            = 'public/';
var src               = './';
var srcStylesheets    = src + '_sass/';
var srcJavascripts    = src + '_js/';
var srcInclude        = src + '_includes/';
var srcLayout         = src + '_layouts/';
var srcImg            = src + '_img/';
var srcPost           = src + '_posts/';
var srcTemplates      = src + 'templates/';
var bowerDir          = src + 'bower_components/';

// -->
// Compass & SASS
// <--
gulp.task('compass', function() {
    return sass(srcStylesheets + '*.scss', {
            style: 'compressed',
            loadPath: [
                bowerDir + 'fontawesome/scss',
                bowerDir + 'bourbon/app/assets/stylesheets'
            ]
        })
        .on('error', sass.logError)
        .pipe(addsrc(bowerDir + 'qTip2/dist/jquery.qtip.min.css'))
        .pipe(debug())
        .pipe(options.production ? minifyCSS({keepBreaks: false, keepSpecialComments:true}) : utils.noop())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(distStylesheets));
});

// -->
// HTML
// <--
gulp.task('html', ['jekyll'], function() {
    // --> Minhtml
    return gulp.src([
        path.join(deploy, '*.html'),
        path.join(deploy, '*/*/*.html'),
        path.join(deploy, '*/*/*/*.html')
    ])
        .pipe(options.production ? htmlmin({collapseWhitespace: true}) : utils.noop())
        .pipe(gulp.dest(deploy))
        .pipe( options.production ? utils.noop() : browserSync.reload({stream:true, once: true}) );
});

// -->
// Browser Sync
// <--
gulp.task('browser-sync', function() {
    return browserSync.init(null, {
        server: {
            baseDir: "./" + deploy
        }
    });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    return browserSync.reload();
});

// -->
// js
// Concatenate & JS build
// <--
gulp.task('js-modernizr',function(){
    return gulp.src([bowerDir + 'modernizr/dist/modernizr-build.js'])
        .pipe(concat('modernizr.js'))
        .pipe(gulp.dest(distJavascripts))
        .pipe(rename('modernizr.min.js'))
        .pipe(options.production ? uglify() : utils.noop())
        .pipe(gulp.dest(distJavascripts));
});

gulp.task('js',['js-modernizr'],function () {
    return gulp.src([
        bowerDir + 'jquery/dist/jquery.min.js',
        bowerDir + 'underscore/underscore-min.js',
        bowerDir + 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        bowerDir + 'qTip2/dist/jquery.qtip.min.js',
        srcJavascripts + 'modules/*.js',
        srcJavascripts + 'pages/*.js',
        srcJavascripts + 'scripts.js'])
        .pipe(concat(pkg.name + '.js'))
        .pipe(gulp.dest(distJavascripts))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(options.production ? uglify() : utils.noop())
        .pipe(gulp.dest(distJavascripts));
});

// -->
// JEKYLL task
// <--
gulp.task('jekyll', ['images', 'js', 'compass'], function (gulpCallBack){
    var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
    // After build: cleanup HTML
    var jekyll = spawn(jekyll, ['build'], {stdio: 'inherit'});

    jekyll.on('exit', function(code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
});

// -->
// Icons task
// <--
gulp.task('icons', function() {
    return gulp.src(bowerDir + 'fontawesome/fonts/**.*')
        .pipe(gulp.dest(distFont));
});

// -->
// Icons task
// <--
gulp.task('images', function() {
    return gulp.src(srcImg + '**')
        .pipe(options.production ? imagemin({
            progressive: true,
            optimizationLevel : 3
        }) : utils.noop())
        .pipe(gulp.dest(distImages));
});

gulp.task('generate',['compass', 'js', 'icons', 'images', 'html']);

// -->
// Default task
// <--
gulp.task('default', ['compass', 'js', 'icons', 'images', 'html', 'browser-sync'], function (event) {
    // --> CSS
    gulp.watch(srcStylesheets+"**", ['html']);
    gulp.watch([
        srcInclude + '*.html',
        srcLayout + '*.html',
        srcPost + '**',
        src + '*.{md,html}'
    ], ['html']);
    // --> Ruby
    gulp.watch(path.join(dist, '*/*.rb'), ['html']);
    // --> JS
    gulp.watch([srcJavascripts+"**/*.js"], ['html']);
});