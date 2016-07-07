/**
 * Libs import
 * --> How to install? npm install --save-dev gulp-minify-html
 * @type {[type]}
 */
var gulp = require('gulp');
var path = require('path');
var debug = require('gulp-debug');
// CSS
var sass = require('gulp-ruby-sass');
var cleanCSS = require('gulp-clean-css');

// JS BUILD
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// HTML
var htmlmin = require('gulp-htmlmin');

// Browser sync
var browserSync = require('browser-sync');

// Import files
var pkg = require('./package.json');

// Images files
var imagemin = require('gulp-imagemin');

// Utils
var utils = require('gulp-util');
var options = require("minimist")(process.argv.slice(2));
var addsrc = require('gulp-add-src');
var spawn = require('child_process').spawn;


var dist              = 'public/';
var distAssets        = './assets/';
var distStylesheets   = distAssets + 'css/';
var distJavascripts   = distAssets + 'js/';
var distImages        = distAssets + 'img/';
var distFont          = distAssets + 'fonts/';
var deploy            = 'public/';
var src               = './';
var srcStylesheets    = src + '_assets/styles/';
var srcJavascripts    = src + '_assets/scripts/';
var srcInclude        = src + '_includes/';
var srcLayout         = src + '_layouts/';
var srcImg            = src + '_assets/images/';
var srcPost           = src + '_posts/';
var bowerDir          = src + '_assets/vendor/';

// -->
// Compass & SASS
// <--
gulp.task('compass', function() {
    return sass(srcStylesheets + '*.scss', {
            style: 'compressed'
        })
        .on('error', sass.logError)
        .pipe(debug())
        .pipe(options.production ? cleanCSS({compatibility: 'ie8'}) : utils.noop())
        .pipe(concat('style.min.css'))
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
        bowerDir + 'fastclick/lib/fastclick.js',
        bowerDir + 'jquery/dist/jquery.min.js',
        bowerDir + 'simple-jekyll-search/dest/jekyll-search.js',
        bowerDir + 'bootstrap-sass/assets/javascripts/bootstrap.js',
        bowerDir + 'ekko-lightbox/dist/ekko-lightbox.js',
        bowerDir + 'moment/moment.js',
        srcJavascripts + 'modules/*.js',
        srcJavascripts + 'pages/*.js',
        srcJavascripts + 'blog.js'])
        .pipe(concat(pkg.name + '.min.js'))
        .pipe(options.production ? uglify() : utils.noop())
        .pipe(gulp.dest(distJavascripts));
});

// -->
// JEKYLL task
// <--
gulp.task('jekyll', ['images', 'js', 'compass'], function (gulpCallBack){
    var jekyllCmd = process.platform === "win32" ? "jekyll.bat" : "jekyll";
    // After build: cleanup HTML
    var jekyll = spawn(jekyllCmd, ['build'], {stdio: 'inherit'});

    jekyll.on('exit', function(code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
});

// -->
// Icons task
// <--
gulp.task('icons', function() {
    return gulp.src(bowerDir + 'font-awesome/fonts/**.*')
        .pipe(gulp.dest(distFont));
});

// -->
// Images task
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