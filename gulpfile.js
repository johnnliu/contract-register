"use strict";

let gulp = require("gulp"),
	gutil = require("gulp-util"),
	watch = require("gulp-watch"),
    eslint = require("gulp-eslint"),
    webpack = require('webpack'),
    config = require("./webpack.config.js"),
	o365 = require("./o365-user.js"),
	spsave = require('gulp-spsave');

var spSaveConfig = {
			"username": o365.username,
			"password": o365.password,
			"siteUrl": o365.site,
			"folder": 'SiteAssets'
};

gulp.task("lint", () => {
	return gulp.src("./src/**/*.js")
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task("build", ["lint", "webpack:build"]);

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var buildConfig = Object.create(config);
	buildConfig.plugins = buildConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(buildConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("deploy", ["webpack:build"], function(){

	gulp.src('./dist/SiteAssets/**/*')
	.pipe(
		spsave({
			"username": o365.username,
    		"password": o365.password,
    		"siteUrl": o365.site,
			"folder": 'SiteAssets' 
		}));

});

// modify some webpack config options
var devConfig = Object.create(config);
devConfig.devtool = "sourcemap";
devConfig.debug = true;

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	webpack(devConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack:build-dev-watch", function () {
	//set webpack watch
	var devWatchConfig = Object.create(devConfig);
	devWatchConfig.watch = true;
	// run webpack
	webpack(devWatchConfig, function (err, stats) {
		if (err) throw new gutil.PluginError("webpack:build-dev-watch", err);
		gutil.log("[webpack:build-dev-watch]", stats.toString({
			colors: true
		}));
	});
});

//Watcher task. 
//This taks will upload a new dev build and continue watching for any changes in the dist/SiteAssets/* files and then upload changes to SharePoint.
gulp.task("deploy-watch", ["webpack:build-dev-watch"], function () {
	//need awaitWritefinish to prevent uploading twice https://github.com/paulmillr/chokidar#api
	watch('./dist/SiteAssets/**/*', { awaitWriteFinish: true })
		.pipe(spsave(spSaveConfig));
});
