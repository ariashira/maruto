const gulp = require("gulp"); // gulp本体
const del = require("del"); // distフォルダ内の画像削除
//pugとhtmlbeautify
const pug = require("gulp-pug");
const htmlbeautify = require("gulp-html-beautify");

//scss
const sass = require("gulp-dart-sass"); // Dart Sass
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const notify = require("gulp-notify"); // エラー発生時のアラート出力
const browserSync = require("browser-sync"); // ブラウザリロード
const autoprefixer = require("gulp-autoprefixer"); //ベンダープレフィックス自動付与

//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

// 入出力するフォルダを指定
const workBase = "../_working";
const distBase = "../_dist";

const srcPath = {
  scss: workBase + "/assets/scss/**/*.scss",
  css: workBase + "/assets/scss/**/*.css",
  html: workBase + "/**/*.html",
  php: workBase + "/**/*.php",
  files: workBase + "/assets/files/**/*",
  img: workBase + "/assets/img/**/*",
  js: workBase + "/assets/js/**/*.js",
  pug: workBase + "/assets/pug/**/!(_)*.pug",
  pug_watch: workBase + "/assets/pug/**/*.pug",
};

const distPath = {
  css: distBase + "/assets/css/",
  html: distBase + "/",
  php: distBase + "/",
  files: distBase + "/assets/files/",
  img: distBase + "/assets/img/",
  js: distBase + "/assets/js/",
  pug: distBase + "/",
};

/**
 * pug (htmlbeautifyも含む)
 */
const compilePug = () => {
  // return gulp.src([workBase + "/pug/**/*.pug", !workBase + "/pug/**/_*.pug" ])
  return (
    gulp
      // .src(workBase + "/pug/**/!(_)*.pug")
      .src(srcPath.pug)
      // .pipe(pug({
      //   pretty: true
      // }))
      .pipe(pug())
      .pipe(
        htmlbeautify({
          indent_size: 2,
          indent_char: " ",
        })
      )
      .pipe(gulp.dest(distBase))
  );
};

/**
 * clean
 */
const clean = () => {
  return del([distBase + "/**"], {
    force: true,
  });
};

//ベンダープレフィックスを付与する条件
const TARGET_BROWSERS = [
  "last 2 versions", //各ブラウザの2世代前までのバージョンを担保
  "ie >= 11", //IE11を担保
];

/**
 * sass
 *
 */
const cssSass = () => {
  return gulp
    .src(srcPath.scss, {
      sourcemaps: true,
    })
    .pipe(
      //エラーが出ても処理を止めない
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"),
      })
    )
    .pipe(sass({ outputStyle: "expanded" })) //指定できるキー expanded compressed
    .pipe(autoprefixer(TARGET_BROWSERS)) // ベンダープレフィックス自動付与
    .pipe(gulp.dest(distPath.css, { sourcemaps: "./" })) //コンパイル先
    .pipe(browserSync.stream())
    .pipe(
      notify({
        message: "Sassをコンパイルしました！",
        onLast: true,
      })
    );
};

/**
 * 画像圧縮
 */
const imgImagemin = () => {
  return gulp
    .src(srcPath.img)
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 80,
          }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [
              {
                removeViewbox: false,
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(gulp.dest(distPath.img));
};

/**
 * html
 */
const html = () => {
  return gulp.src(srcPath.html).pipe(gulp.dest(distPath.html));
};

/**
 * php
 */
const php = () => {
  return gulp.src(srcPath.php).pipe(gulp.dest(distPath.php));
};

/**
 * js
 */
const js = () => {
  return gulp.src(srcPath.js).pipe(gulp.dest(distPath.js));
};
/**
 * css
 */
const css = () => {
  return gulp.src(srcPath.css).pipe(gulp.dest(distPath.css));
};

/**
 * files
 */
const files = () => {
  return gulp.src(srcPath.files).pipe(gulp.dest(distPath.files));
};

/**
 * ローカルサーバー立ち上げ
 */
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

const browserSyncOption = {
  server: distBase,
};

/**
 * リロード
 */
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

/**
 *
 * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
 * series 順番に実行
 * watch('監視するファイル',処理)
 */
const watchFiles = () => {
  gulp.watch(srcPath.scss, gulp.series(cssSass, browserSyncReload));
  gulp.watch(srcPath.css, gulp.series(css, browserSyncReload));
  gulp.watch(srcPath.html, gulp.series(html, browserSyncReload));
  gulp.watch(srcPath.php, gulp.series(php, browserSyncReload));
  gulp.watch(srcPath.files, gulp.series(files, browserSyncReload));
  gulp.watch(srcPath.pug_watch, gulp.series(compilePug, browserSyncReload));
  gulp.watch(srcPath.img, gulp.series(imgImagemin, browserSyncReload));
  gulp.watch(srcPath.js, gulp.series(js, browserSyncReload));
};

/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 */
exports.default = gulp.series(
  clean,
  // gulp.parallel(html, cssSass, imgImagemin, js, compilePug),
  gulp.parallel(html, cssSass, css, imgImagemin, js, compilePug, php, files),
  gulp.parallel(watchFiles, browserSyncFunc)
);
