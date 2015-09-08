'use strict';

var watchify        = require('watchify');
var gulp            = require('gulp');
var nodemon         = require('gulp-nodemon');

var config = {
   assetPath:   './public/css',
  imgPath:    './assets/img'
};

gulp.task('dev', function () {
  nodemon({ script: 'hello.js'
          , ext: 'html js ejs'
          , ignore: ['ignored.js'] })
    .on('restart', function () {
      console.log('restarted!')
    })
});


// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(config.assetsPath + '/**/*.css', ['css']); 
});



  gulp.task('default', ['dev','watch']);

