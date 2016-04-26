var gulp = require('gulp');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');

// browser sync
var browserSync = require('browser-sync').create();

// build plugins
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

var del = require('del');

// Task: Browser Sync
gulp.task('browserSync', function () {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: ['./', './app']
		}
	})
});

// Task : Sass compile, reload browserSync server after that
gulp.task('sass', function () {
	return gulp.src('app/scss/styles.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('fonts', function() {
	return gulp.src('app/font/**/*')
	.pipe(gulp.dest('dist/font'))
});

gulp.task('images', function() {
	return gulp.src('app/css/images/**/*.+(png|jpg|gif|svg)')
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

// Task : Clean Dist folder
gulp.task('clean:dist', function () {
	return del.sync('dist');
});

gulp.task('useref', function () {
	return gulp.src('app/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('watch', ['browserSync', 'sass'], function () {
	gulp.watch('app/scss/*.scss', ['sass']);
});

gulp.task('default', function (callback) {
	runSequence(['sass', 'browserSync', 'watch'], callback);
});

gulp.task('build', function (callback) {
	runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});