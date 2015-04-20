
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefix = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var Path = require('path');
var plovr = require('gulp-plovr');



var config = {
  sassPath: './src/sass',
  uiEntryPoint: './src/main.js',
  bowerPath: './bower_components',
  deployPath: './dist',
  plovrConfig: './plovr.json'
};



// Main Tasks
gulp.task('default', ['icons', 'css', 'closure-require']);
gulp.task('watch', ['closure-require', 'css'], watch);
gulp.task('watch-sass', ['css'], watchSass);
gulp.task('closure-require', closureRequire);
gulp.task('icons', icons);
gulp.task('css', css);



function watch() {
  gulp.watch(['./src/**/*.js'], ['closure-require']);
  gulp.watch([Path.resolve(config.sassPath, '**/*.sass')], ['css']);
}

function watchSass() {
  gulp.watch(config.sassPath + '/**/*.sass', ['css']);
}

function css() {
  return sass(Path.join(config.sassPath, 'main.sass'), {
    style: 'compressed',
    loadPath: [
      config.sassPath,
      Path.join(config.bowerPath, 'bootstrap-sass-official/assets/stylesheets'),
      Path.join(config.bowerPath, 'fontawesome/scss')
    ],
    'sourcemap=none': true
  })
  .on('error', notify.onError(function(error) {
    return 'Error: ' + error.message;
  }))
  .pipe(autoprefix('last 2 version'))
  .pipe(gulp.dest(Path.join(config.deployPath, 'css')));
}

function icons() {
  return gulp.src([
    config.bowerPath + '/bootstrap-sass-official/assets/fonts/bootstrap/**.*',
    config.bowerPath + '/fontawesome/fonts/**.*'
  ])
  .pipe(gulp.dest(Path.join(config.deployPath, 'css/fonts')));
}

function closureRequire() {
  gulp.src([config.plovrConfig])
  .pipe(plovr({
    debug: false
  }));
}
