var gulp= require('gulp');
var sass= require('gulp-sass');

var browserSync= require('browser-sync').create();
var runSequence= require('run-sequence');

gulp.task('sass', function() {
	return gulp.src('app/scss/styles.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: ['./', './app']
		}
	})
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/*.scss', ['sass']);
});

gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'], callback);
});