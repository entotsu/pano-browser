var gulp = require("gulp");
var browserSync = require("browser-sync");
 
var stylus = require('gulp-stylus');
var plumber = require('gulp-plumber'); 
var pleeease = require('gulp-pleeease');



gulp.task('stylus_task', function () {
    gulp.src('./stylus/*.styl')
        .pipe(plumber())              // エラー出ても止まらないようにする
        .pipe(stylus())               // 実際コンパイルしてるのはここ
        // .pipe(autoprefixer(config.autoprefixer))  // vendor-prefixつける
        .pipe(pleeease({
            autoprefixer: {
                browsers: ['last 2 versions']
            },
            minifier: false
        }))
        .pipe(gulp.dest('css/'))
});




gulp.task("server_task", function() {
    browserSync({
        browser: 'Google Chrome Canary',
        server: {
            baseDir: "./"
        }
    });
});



gulp.task("js_task", function() {
    gulp.src("javascripts/*.js")
        .pipe(browserSync.reload({stream:true}))
});


gulp.task("css_task", function() {
    gulp.src("css/*.css")
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('html_task', function () {
  gulp.src('./*.html')
    .pipe(browserSync.reload({stream:true}))
});
 

 
gulp.task("default",['server_task'], function() {
    console.log('default task is launched.');


    gulp.run('stylus_task');

    gulp.watch("./stylus/*.styl",["stylus_task"]);
    gulp.watch("./*.html",["html_task"]);
    gulp.watch("javascripts/*.js",["js_task"]);
    gulp.watch("css/*.css",["css_task"]);
});