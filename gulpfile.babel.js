import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import istanbul from 'gulp-istanbul';
import plumber from 'gulp-plumber';
import mocha from 'gulp-mocha';
import uglify from 'gulp-uglify';
import header from 'gulp-header';
import fs from "fs-extra";

const plumberConf = {};

const test = (done) => {
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
            done();
        });
    });
};

const lint = () => {
    return gulp.src(['lib/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

const build = () => {
  const headerTxt = fs.readFileSync("./copyright-header.txt");
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));

  return gulp.src('lib/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('convergence-jwt.js'))
    .pipe(header(headerTxt, {package: packageJson}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
};

const copyFiles = () => {
  return gulp.src(['package.json', 'README.md', 'LICENSE.txt'])
    .pipe(gulp.dest('dist'));
};

const minify = () => {
  return gulp.src('dist/convergence-jwt.js')
    .pipe(sourcemaps.init())
    .pipe(uglify({
        output: {
          comments: "some"
        }
    }))
    .pipe(concat('convergence-jwt.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
};

const clean = (done) => {
  fs.removeSync("dist");
  done();
};

const dist = gulp.series(
  lint, build, copyFiles, minify
);

export {
  clean,
  dist,
  test
}
