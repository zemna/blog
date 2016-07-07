---
layout: post
title:  "Automated Deploy with Jekyll, Gulp, Travis CI and GitHub Pages"
excerpt: "Learning how to automatically deploy website with Jekyll, Gulp, Travis CI and Github Pages"
date:   2016-07-07 09:00:00 +0700
categories: jekyll
tags: jekyll gulp travis-ci github-pages
---

### 1. Make .travis.yml file to root

```yml
language: node_js

node_js:
  - '4'

cache:
  directories:
  - node_modules
  - _assets/vendor

before_install:
  - rvm install 2.2
  - rvm use 2.2 --fuzzy
  - export GEMDIR=$(rvm gemdir)

before_script:
  - npm install -g gulp
  - npm install -g bower
  - gem install jekyll
  - gem install jekyll-paginate
  - gem install jekyll-sitemap
  - gem install jekyll-feed
  - gem install html-proofer
  - chmod +x ./build.sh

# execute this script on each commit
script: "./build.sh"

# only take into account 'master' branch
branches:
  only:
  - master

env:
  global:
  - NOKOGIRI_USE_SYSTEM_LIBRARIES=true # speed up installation of html-proofer

sudo: false # route your build to the container-based infrastructure for a faster build
```

### 2. Generate `Personal access tokens` from GitHub website

1. Click `settings` menu
2. Click `Personal access tokens` menu
3. Click `Generate new token` button
    1. Input `Token description` like `travis`
    2. Check `repo` scope

Copy new token to bellow step.

### 3. Generate secure key to .travis.yml

Install Travis CLI.

```bash
$ gem install travis
```

Use `encrypt` command to encrypt data

```bash
$ travis encrypt GH_TOKEN=/*Paste new token here*/
```

This command will add secret item to .travis.yml file.

### 4. Make `gulpfile.js` file to root

I followed [this article](http://cabirol-florian.com/js/2015/10/16/Gulp-Jekyll-Travis-Github/) to generate `gulpfile.js`.

```javascript
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
```

### 5. Make `build.sh` file to root

This will execute `npm run build`, `gulp generate --production` and `htmlproofer ./public --disable-external --allow-hash-ref` command step by step and commits result to gh-pages branch.

```bash
#!/bin/bash
#
## only process script when started not by pull request (PR)
if [ $TRAVIS_PULL_REQUEST == "true" ]; then
  echo "this is PR, exiting"
  exit 0
fi

# enable error reporting to the console
set -e

# build site with jekyll, by default to 'public' folder
npm run build
gulp generate --production
htmlproofer ./public --disable-external --allow-hash-href

# cleanup
rm -rf ../blog.zemna.net.gh-pages

# clone 'gh-pages' branch of the repository using encrypted GH_TOKEN for authentification
git clone -b gh-pages https://${GH_TOKEN}@github.com/zemna/blog.git ../blog.zemna.net.gh-pages

# copy generated HTML site to 'gh-pages' branch
cp -R public/* ../blog.zemna.net.gh-pages

# commit and push generated content to 'gh-pages' branch
# since repository was cloned in write mode with token auth - we can push there
cd ../blog.zemna.net.gh-pages
git config user.email "zemna@zemna.net"
git config user.name "zemna"
git add -A .
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --quiet origin gh-pages > /dev/null 2>&1
```

### 6. Exclude file(s) or folder(s) from Jekyll build process

Add necessary file(s) or folder(s) to _config.yml file like bellow. Those files will not be built by Jekyll.

```yml
exclude:
  - lib
  - Gemfile
  - Gemfile.lock
  - node_modules
  - bower.json
  - "*.sh"
  - README.md
  - gulffile.js
  - package.json
```

### 7. Conclusion

You can see running example by [https://github.com/zemna/blog](https://github.com/zemna/blog) repository.