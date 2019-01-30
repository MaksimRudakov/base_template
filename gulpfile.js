var gulp            = require('gulp'),
	stylus          = require('gulp-stylus'),
	plumber         = require('gulp-plumber'),
	browserSync     = require('browser-sync').create(),
	del             = require('del'),
	concat          = require('gulp-concat'),
	pug             = require('gulp-pug'),
	sourcemaps      = require('gulp-sourcemaps'),
	uglify          = require('gulp-uglify'),
	notify          = require('gulp-notify'),
	cleanCSS        = require('gulp-clean-css'),
	gulpPugBeautify = require('gulp-pug-beautify'),
	reload          = browserSync.reload;

// destination folder
var src  = 'static/';
var dest = 'dist/';

// error handler function
var onError = function (error) {
	notify({
		title: 'Task Failed [' + error.plugin + ']',
		message:  error.toString(),
	}).write(error);
	console.error(error.toString());
	this.emit('end');
};

var src_paths = {
	stylus: src + 'stylus/**/[^_]*.styl',
	pug: src + 'pug/**/[^_]*.pug',
	js: src + 'js/**/*.js',
};

var watch_paths = {
	stylus: src + 'stylus/**/*.styl',
	js: src + 'js/**/*.js',
	pug: src + 'pug/**/*.pug',
};

gulp.task('stylus', function() {
	return gulp.src(src_paths.stylus)         		// get source paths from array above
	.pipe(sourcemaps.init())                        // helps connect source files and production files
	.pipe(plumber({errorHandler: onError})) 		// prevents gulp.watch from crashing, finds errors in stream
	.pipe(stylus())
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(sourcemaps.write('../maps'))              // helps connect source files and production files
	.pipe(gulp.dest(dest + 'css'))          		// send result to css folder in build
	.pipe(browserSync.reload({stream: true, match: '**/*.css'}))
});

gulp.task('pug', function() {
	return gulp.src(src_paths.pug)
	.pipe(sourcemaps.init())
	.pipe(plumber({errorHandler: onError})) // plumber finds errors in stream
	.pipe(pug({pretty: true,}))
	.pipe(sourcemaps.write('../maps'))
	.pipe(gulpPugBeautify({ omit_empty: true, fill_tab: true, tab_size: 4 }))
	.pipe(gulp.dest(dest + 'html'))
});

gulp.task('js', function() {
	return gulp.src(src_paths.js)
	.pipe(sourcemaps.init())
	.pipe(plumber({errorHandler: onError})) // plumber finds errors in stream
	.pipe(concat('all.min.js'))
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(uglify())
	.pipe(sourcemaps.write('../maps'))
	.pipe(gulp.dest(dest + 'js'))
});

gulp.task('default', gulp.series('js', 'stylus', 'pug', function () {

	browserSync.init({
		startPath: 'html',
		server: {
		baseDir: './dist/',
	},
		notify: false
	});


	gulp.watch(watch_paths.stylus, gulp.series('stylus'));
	gulp.watch(watch_paths.js, gulp.series('js', function(done){
		browserSync.reload();
		done();
	}));
	gulp.watch(watch_paths.pug,    gulp.series('pug', function(done){
		browserSync.reload();
		done();
	}));

}));

