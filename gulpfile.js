// Load dependencies
var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({advanced: true});

// Less to css and minify
function css(done) {
	gulp.src('./assets/less/**/*.less')
		.pipe(less({
			plugins: [cleancss],
			paths: [ path.join(__dirname, 'less', 'includes') ],
		}))
		.pipe(gulp.dest('./assets/css'));
	done();
}
gulp.task('css', css);

// Watch for changes and run task
gulp.task('watch', function(done) {
	gulp.watch('./assets/less/**/*.less', css);
	done();
});

// Create local HTTP server
gulp.task('serve', function(done) {
	connect.server({
		root:'./',
		port: 9001,
		livereload: true,
	});
	done();
});

gulp.task('default', function(done) {
	console.log('Gulp Ready');
	done();
});
