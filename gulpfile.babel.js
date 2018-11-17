import path from 'path';
import gulp from 'gulp';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import ejs from 'gulp-ejs';
import glob from 'glob';

import appConst from './src/appConst';

const srcScssPath = glob.sync('src/assets/styles/**/*.scss');
const srcTemplatePath = glob.sync('src/assets/views/*.ejs');
const distPath = 'addon/dist';
const dirCssPath = 'style.css';
const templateRoot = path.resolve(__dirname, 'src/assets/views');

const srcTestTemplatePath = 'tests/fixture/*.ejs';

gulp.task('css', () => {
  return gulp
    .src(srcScssPath)
    .pipe(sass())
    .pipe(concat(dirCssPath))
    .pipe(gulp.dest(distPath));
});

gulp.task('html', () => {
  return gulp
    .src(srcTemplatePath)
    .pipe(ejs({ appConst }, {}, { ext: '.html' }))
    .pipe(gulp.dest(distPath));
});

gulp.task('test:html', () => {
  return gulp
    .src(srcTestTemplatePath, {
      base: './' // output same dir with src dir
    })
    .pipe(ejs({ appConst, templateRoot }, {}, { ext: '.html' }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
  gulp.watch(srcScssPath, gulp.parallel('css')),
  gulp.watch(srcTemplatePath, gulp.parallel('html')),
  gulp.watch(srcTestTemplatePath, gulp.parallel('test:html'));
});

gulp.task('default', gulp.parallel('css', 'html', 'test:html'));
