"use strict";

let gulp = require("gulp"),
	gutil = require("gulp-util"),
	watch = require("gulp-watch"),
    eslint = require("gulp-eslint"),
    webpack = require('webpack'),
    config = require("./webpack.config.js"),
	user = require("./user.js"),
	spsave = require("gulp-spsave");

gulp.task("build", ["lint", "webpack:build"]);

var spSaveConfig = {
	"username": user.username,
	"password": user.password,
	"siteUrl": user.site,
	"folder": 'SiteAssets'
};

gulp.task("lint", () => {
	return gulp.src("./src/**/*.js")
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task("webpack:build", function (callback) {
	// run webpack
	webpack(config, function (err, stats) {
		if (err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("deploy", ["webpack:build"], function () {

	return gulp.src('./dist/SiteAssets/**/*')
		.pipe(spsave(spSaveConfig));
});

var devConfig = Object.create(config);
devConfig.devtool = "sourcemap";
devConfig.debug = true;

gulp.task("webpack:build-dev", function (callback) {
	// run webpack
	webpack(devConfig, function (err, stats) {
		if (err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack:build-dev-watch", function (callback) {
	//set webpack watch
	var devWatchConfig = Object.create(devConfig);
	devWatchConfig.watch = true;
	// run webpack
	webpack(devWatchConfig, function (err, stats) {
		if (err) throw new gutil.PluginError("webpack:build-dev-watch", err);
		gutil.log("[webpack:build-dev-watch]", stats.toString({
			colors: true
		}));
		callback();
	});
});

//Watcher task. 
//This taks will upload a new dev build and continue watching for any changes in the dist/SiteAssets/* files and then upload changes to SharePoint.
gulp.task("deploy-watch", ["webpack:build-dev-watch"], function () {
	//need awaitWritefinish to prevent uploading twice https://github.com/paulmillr/chokidar#api
	watch('./dist/SiteAssets/**/*', { awaitWriteFinish: true })
		.pipe(spsave(spSaveConfig));
});
