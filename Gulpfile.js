'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const Path = require('path');
const plovr = require('gulp-plovr');
const webpackStream = require('webpack-stream');


const SASS_DIR = './src/sass';
const BOWER_DIR = './bower_components';
const DEPLOY_DIR = './dist';
const UI_ENTRY_POINT = './src/main.js';
const PLOVR_CONFIG = './plovr.json';

const SASS_INCLUDE_PATHS = [
  SASS_DIR,
  Path.join(BOWER_DIR, 'bootstrap-sass-official/assets/stylesheets'),
  Path.join(BOWER_DIR, 'fontawesome/scss'),
  Path.join(__dirname, './node_modules'),
];


gulp.task('default', ['icons', 'css', 'closure-require']);
gulp.task('watch', ['closure-require', 'css'], watch);
gulp.task('watch-sass', ['css'], watchSass);
gulp.task('closure-require', closureRequire);
gulp.task('icons', icons);
gulp.task('css', css);
gulp.task('webpack', webpack);


function watch() {
  gulp.watch(['./src/closure/require.js'], ['closure-require']);
  gulp.watch(Path.join(SASS_DIR, '**/*.sass'), ['css']);
}

function watchSass() {
  gulp.watch(SASS_DIR + '/**/*.sass', ['css']);
}

function css() {
  return gulp.src(Path.join(SASS_DIR, 'main.sass'))
    .pipe(sass({
      includePaths: SASS_INCLUDE_PATHS
    }).on('error', sass.logError))
    .pipe(gulp.dest(DEPLOY_DIR));
}

function icons() {
  return gulp.src([
    BOWER_DIR + '/bootstrap-sass-official/assets/fonts/bootstrap/**.*',
    BOWER_DIR + '/fontawesome/fonts/**.*'
  ])
  .pipe(gulp.dest(Path.join(DEPLOY_DIR, 'fonts')));
}

function closureRequire() {
  gulp.src([PLOVR_CONFIG])
  .pipe(plovr({
    debug: false
  }));
}

function webpack() {
  return gulp.src('src/ui-main.js')
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
}
