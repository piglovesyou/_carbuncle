'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const Path = require('path');
const plovr = require('gulp-plovr');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');
const gutil = require('gulp-util');

const SASS_DIR = './src/style';
const NODE_MODULES_DIR = './node_modules';
const DEPLOY_DIR = './dist';
const UI_ENTRY_POINT = './src/main.js';
const PLOVR_CONFIG = './plovr.json';

const SASS_INCLUDE_PATHS = [
  SASS_DIR,
  Path.join(NODE_MODULES_DIR, 'font-awesome/scss'),
  Path.join(__dirname, './node_modules'),
];


gulp.task('default', ['icons', 'css', 'closure-require', 'js']);


gulp.task('watch', [], () => {
  gulp.watch(['./src/closure/require.js'], ['closure-require']);
  gulp.watch(Path.join(SASS_DIR, '**/*.sass'), ['css']);
  launchWebpackDevServer();
});

gulp.task('watch-sass', ['css'], () => {
  gulp.watch(SASS_DIR + '/**/*.sass', ['css']);
});

gulp.task('css', () => {
  return gulp.src(Path.join(SASS_DIR, 'main.sass'))
    .pipe(sass({
      includePaths: SASS_INCLUDE_PATHS
    }).on('error', sass.logError))
    .pipe(gulp.dest(DEPLOY_DIR));
});

gulp.task('icons', () => {
  return gulp.src([
    NODE_MODULES_DIR + '/font-awesome/fonts/*'
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

gulp.task('webpack-dev-server', launchWebpackDevServer);

function launchWebpackDevServer(callback) {
  const config = webpack(require('./webpack.config'));

  new WebpackDevServer(config, {}).listen(3189, 'localhost', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:3189/webpack-dev-server/index.html');
      // callback();
  });
}
