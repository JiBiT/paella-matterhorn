"use strict"
var gulp = require('gulp');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var spawn = require('child_process').spawn;
var gls = require('gulp-live-server');
var mergeStream = require('merge-stream');

function runSequence( tasks ) {
    if( !tasks || tasks.length <= 0 ) return;
    const task = tasks[0];
    gulp.start( task, function() {
        console.log( task + " finished" );
        runSequence( tasks.slice(1) );
    });
}

gulp.task('paella-opencast:clean', function () {
    return gulp.src('build', {read: false}).pipe(clean());
});


gulp.task('paella-opencast:prepare:source', function () {
    var s1 = gulp.src('node_modules/paellaplayer/**').pipe(gulp.dest('build/paella'));
    var s2 = gulp.src('paella-opencast/plugins/**').pipe(gulp.dest('build/paella/plugins'));

    return mergeStream(s1, s2);
});


gulp.task('paella-opencast:prepare', ['paella-opencast:prepare:source'], function (cb) {
    var cmd_npm = spawn('npm', ['install'], {cwd: 'build/paella', stdio: 'inherit'});
    cmd_npm.on('close', function (code) {
        cb(code);
    });
});


gulp.task('paella-opencast:compile.debug', ['paella-opencast:prepare'], function (cb) {
    var cmd_npm = spawn('node', ['node_modules/gulp/bin/gulp.js', 'build.debug'], {cwd: 'build/paella'/*, stdio: 'inherit'*/});
    cmd_npm.on('close', function (code) {
        cb(code);
    });
});

gulp.task('paella-opencast:compile.release', ['paella-opencast:prepare'], function (cb) {
    var cmd_npm = spawn('node', ['node_modules/gulp/bin/gulp.js', 'build.release'], {cwd: 'build/paella'/*, stdio: 'inherit'*/});
    cmd_npm.on('close', function (code) {
        console.log(code);
        cb(code);
    });
});


gulp.task('paella-opencast:build', ["paella-opencast:compile.debug"], function () {
    runSequence(['paellaCustomBuild', 'beuth']);
});

gulp.task('paellaCustomBuild', ["paella-opencast:compile.debug"], function () {
    var s1 = gulp.src('build/paella/build/player/**').pipe(gulp.dest('build/paella-opencast'));
    var s2 = gulp.src('paella-opencast/ui/**').pipe(gulp.dest('build/paella-opencast'));
    return  mergeStream(s1, s2);
});

gulp.task('paella-opencast:server', function () {
    var server = gls.static('build/paella-opencast', 8000);
    server.start();
});

gulp.task('default', ['paella-opencast:build']);

/* CUSTOM */
gulp.task('beuth', function () {
    var s1 = gulp.src('beuth/build/paella-opencast/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'IE > 8', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(gulp.dest('beuth/build/paella-opencast/css/'));
    var s2 = gulp.src('beuth/build/**/*').pipe(gulp.dest('build/'));

    return mergeStream(s1, s2);
});

gulp.task('beuth-watch', function () {
    gulp.run('paella-opencast:server');
    gulp.watch('beuth/build/paella-opencast/**/*', ['paella-opencast:beuth']);
});