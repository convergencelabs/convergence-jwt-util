const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const plumber = require('gulp-plumber');
const mocha = require('gulp-mocha');
const uglify = require('gulp-uglify');
const del = require('del');

const plumberConf = {};

gulp.task('default', ['dist'], function () {

});

gulp.task('lint', () => {
  return gulp.src(['lib/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['build'], function (cb) {
   gulp.src('./dist/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('./test/*.js')
        .pipe(plumber(plumberConf))
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('finish', function() {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task('build', ['lint'], function () {
  return gulp.src('lib/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('convergence-jwt.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-files', ['build'], function () {
  return gulp.src(['package.json', 'README.md', 'LICENSE.txt'])
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['test', 'copy-files'], function () {
  return gulp.src('dist/convergence-jwt.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('convergence-jwt.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del("dist");
});