var gulp = require("gulp");
var browserSync = require("browser-sync");
 

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
    gulp.watch("./*.html",["html_task"]);
    gulp.watch("javascripts/*.js",["js_task"]);
    gulp.watch("css/*.css",["css_task"]);
});