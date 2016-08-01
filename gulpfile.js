"use strict";

let gulp = require("gulp"),
	gutil = require("gulp-util"),
    tslint = require("gulp-tslint"),
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    config = require("./webpack.config.js"),
	o365 = require("./o365-user.js"),
	spsave = require('gulp-spsave');

gulp.task("build", ["webpack:build"]);

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
	})
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

// create a single instance of the compiler to allow caching
var devCompiler = webpack(devConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

