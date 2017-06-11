"use strict";
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var gls = require('gulp-live-server');
var gulpif = require('gulp-if');
var mergeStream = require('merge-stream');
var env = require('gulp-env');

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


gulp.task('paella-opencast:build', ['set-prod-env', "paella-opencast:compile.debug"], function () {
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
    if (process.env.NODE_ENV === 'production') {
        gulp.src('build/paella-opencast/info', {read: false}).pipe(clean());
        gulp.src('build/paella-opencast/search', {read: false}).pipe(clean());
    }
        var s1 = gulp.src('beuth/build/paella-opencast/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'IE > 8', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(gulp.dest('beuth/build/paella-opencast/css/'));

    var filesToCopy = ['beuth/build/**/*', '!beuth/build/paella-opencast/{scss,scss/**}'];

    if (process.env.NODE_ENV !== 'development') {
        filesToCopy.push('!beuth/build/paella-opencast/{info,info/**}');
        filesToCopy.push('!beuth/build/paella-opencast/{search,search/**}');
    }

    var s2 = gulp.src(filesToCopy)
        .pipe(gulpif('paella-opencast/javascript/opencast-engage.js', replace('$HOST_URL', process.env.HOST_URL)))
        .pipe(gulpif('paella-opencast/javascript/opencast-engage-search.js', replace('$HOST_URL', process.env.HOST_URL)))
        .pipe(gulpif('paella-opencast/javascript/player-watch.js', replace('$HOST_URL', process.env.HOST_URL)))
        .pipe(gulp.dest('build/'));

    return mergeStream(s1, s2);
});

gulp.task('beuth-serve', ['set-dev-env'], function() {
    var server = gls.static('build/paella-opencast', 8000);
    server.start();
    gulp.start('beuth');
    gulp.watch(['beuth/build/paella-opencast/**/*'], function(file) {
        gulp.start('beuth');
        server.notify.apply(server, [file]);
    });
});

gulp.task('set-dev-env', function() {
    env({
        vars: {
            HOST_URL: 'http://141.64.153.82:8080',
            NODE_ENV: "development"
        }
    });
});

gulp.task('set-prod-env', function() {
    env({
        vars: {
            HOST_URL: '',
            NODE_ENV: "production"
        }
    });
});