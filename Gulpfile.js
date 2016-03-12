'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const Path = require('path');
const plovr = require('gulp-plovr');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevServer = require('webpack-dev-server');
const gutil = require('gulp-util');

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


gulp.task('default', ['icons', 'css', 'closure-require', 'js']);


gulp.task('watch', ['closure-require', 'css', 'js'], () => {
  gulp.watch(['./src/closure/require.js'], ['closure-require']);
  gulp.watch(Path.join(SASS_DIR, '**/*.sass'), ['css']);
  launchWebpackDevServer();
});

gulp.task('watch-sass', ['css'], () => {
  gulp.watch(SASS_DIR + '/**/*.sass', ['css']);
})

gulp.task('css', () => {
  return gulp.src(Path.join(SASS_DIR, 'main.sass'))
    .pipe(sass({
      includePaths: SASS_INCLUDE_PATHS
    }).on('error', sass.logError))
    .pipe(gulp.dest(DEPLOY_DIR));
});

gulp.task('icons', () => {
  return gulp.src([
    BOWER_DIR + '/bootstrap-sass-official/assets/fonts/bootstrap/**.*',
    BOWER_DIR + '/fontawesome/fonts/**.*'
  ])
  .pipe(gulp.dest(Path.join(DEPLOY_DIR, 'fonts')));
});

gulp.task('closure-require', () => {
  gulp.src([PLOVR_CONFIG])
  .pipe(plovr({
    debug: false
  }));
});

gulp.task('js', () => {
  return gulp.src('src/ui-main.js')
    .pipe(webpackStream(require('./webpack.config')))
    .pipe(gulp.dest('dist/'));
});

gulp.task("webpack-dev-server", launchWebpackDevServer);

function launchWebpackDevServer(callback) {
    const compiler = webpack(require('./webpack.config'));

    new webpackDevServer(compiler, {}).listen(3189, "localhost", function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      // Server listening
      gutil.log("[webpack-dev-server]", "http://localhost:3189/webpack-dev-server/index.html");

      // keep the server alive or continue?
      // callback();
    });
}
