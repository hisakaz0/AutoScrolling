const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const ejs = require("gulp-ejs");

const appConst = require("./src/appConst");
const srcScssPath = "src/**/*.scss";
const srcTemplatePath = ["src/options/options.ejs", "src/options/modal.ejs"];
const distPath = "dist";
const distFilename = "style.css";

gulp.task("css", () => {
  return gulp
    .src(srcScssPath)
    .pipe(sass())
    .pipe(concat(distFilename))
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
