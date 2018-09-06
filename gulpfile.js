
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

const srcScssPath = 'src/**/*.scss';
const distPath = 'dist';
const distFilename = 'index.css';

gulp.task('css', () => {
  return gulp.src(srcScssPath)
    .pipe(sass())
    .pipe(concat(distFilename))
    .pipe(gulp.dest(distPath))
});

gulp.task('watch', () => {
  gulp.watch(srcScssPath, [ 'css' ]);
});

gulp.task('default', [ 'css' ]);
