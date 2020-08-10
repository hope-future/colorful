const fs = require('fs')
const gulp = require('gulp')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sassGlob = require('gulp-sass-glob')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const flexBugsFixes = require('postcss-flexbugs-fixes')
const cssWring = require('csswring')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')
const uglify = require('gulp-uglify')
const ejs = require('gulp-ejs')
const htmlmin = require('gulp-htmlmin')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()




//オブション

// Browsersync のオプション
const browserSyncOption = {
  server: './dist'
}


// EJS のオプション  config.json
const configJsonData = fs.readFileSync('./src/ejs/config.json')
const configObj = JSON.parse(configJsonData)
const ejsDataOption = {
  config: configObj
}


// HTML圧縮のオプション  htmlmin
const htmlminOption = {
  collapseWhitespace: true
}


// Autoprefixer のオプション
const autoprefixerOption = {
  grid: true
}


// PostCSS のオプション
const postcssOption = [
  flexBugsFixes,
  autoprefixer(autoprefixerOption),
  // cssWring
]


// 画像圧縮のオプション  imagemin
const imageminOption = [
  imageminPngquant({quality: [.65, .8]}),
  imageminMozjpeg({quality: 80}),
  imagemin.gifsicle(),
  imagemin.optipng(),
  imagemin.svgo()
]


// ブラウザのリロード
const browserReload = (done) => {
  browserSync.reload()
  done()
}




// タスク

// ローカルサーバーの起動
gulp.task('serve', (done) => {
  browserSync.init(browserSyncOption)
  done()
})


// EJS から HTML にコンパイル
gulp.task('ejs', () => {
  return gulp.src('./src/ejs/*.ejs')
    .pipe(ejs(ejsDataOption))
    .pipe(rename({extname: '.html'}))
    // .pipe(htmlmin(htmlminOption))
    .pipe(gulp.dest('./dist'))
})


// Sass から CSS にコンパイル
gulp.task('sass', () => {
  return gulp.src('./src/scss/main.scss', {sourcemaps: true})
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss(postcssOption))
    .pipe(gulp.dest('./dist/css', {sourcemaps: './'}))
})


// JavaScript の圧縮
gulp.task('jsmin', () => {
  return gulp.src('./src/js/*.js')
    .pipe(rename({extname: '.min.js'}))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})


// 画像の圧縮
gulp.task('imagemin', () => {
  return gulp.src('./src/images/*')
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./dist/images'))
})


// ファイル内容の変更の監視 と タスクの実行
gulp.task('watch', (done) => {
  gulp.watch('src/ejs/**/*.ejs', gulp.series('ejs'))
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('src/js/*.js', gulp.series('jsmin'))
  gulp.watch('dist/**/*', browserReload)
})


// 複数のタスクの実行
gulp.task('default', gulp.series('serve', 'watch'))
