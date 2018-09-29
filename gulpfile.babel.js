import path from 'path';
import gulp from "gulp";
import sass from "gulp-sass";
import concat from "gulp-concat";
import ejs from "gulp-ejs";

import appConst from "./src/appConst";

const srcScssPath = "src/assets/styles/**/*.scss";
const srcTemplatePath = [
  "src/assets/views/options.ejs",
  "src/assets/views/modal.ejs"
];
const distPath = "dist";
const dirCssPath = "style.css";
const templateRoot = path.resolve(__dirname, 'src/assets/views');

const srcTestTemplatePath = [
  'tests/fixture/options.ejs'
];

gulp.task("css", () => {
  return gulp
    .src(srcScssPath)
    .pipe(sass())
    .pipe(concat(dirCssPath))
    .pipe(gulp.dest(distPath));
});

gulp.task("html", () => {
  return gulp
    .src(srcTemplatePath)
    .pipe(ejs({ appConst }, {}, { ext: ".html" }))
    .pipe(gulp.dest(distPath));
});

gulp.task('test:html', () => {
  return gulp
    .src(srcTestTemplatePath, {
       base: './' // output same dir with src dir
    })
    .pipe(ejs({ appConst, templateRoot }, {}, { ext: '.html'}))
    .pipe(gulp.dest('./'));
});

gulp.task("watch", () => {
  gulp.watch(srcScssPath, ["css"]);
  gulp.watch(srcTemplatePath, ["html"]);
  gulp.watch(srcTestTemplatePath, ["test:html"]);
});

gulp.task("default", ["css", "html", 'test:html']);
