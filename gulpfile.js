'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
   gulp.src('./public/stylesheets/less/*.less')
   .pipe(less())
   .pipe(gulp.dest('./public/stylesheets/'));
});


gulp.task('serve',() => {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch('./public/stylesheets/less/*.less', ['less']);
  gulp.watch(['./views/*.jade'], electron.reload);
  gulp.watch(['./public/stylesheets/*.css'], electron.reload);

});
