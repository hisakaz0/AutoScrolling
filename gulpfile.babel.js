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
    .pipe(ejs({ appConst: appConst }, {}, { ext: ".html" }))
    .pipe(gulp.dest(distPath));
});

gulp.task("watch", () => {
  gulp.watch(srcScssPath, ["css"]);
  gulp.watch(srcTemplatePath, ["html"]);
});

gulp.task("default", ["css", "html"]);
