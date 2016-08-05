"use strict";

let gulp = require("gulp"),
	gutil = require("gulp-util"),
    eslint = require("gulp-eslint"),
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    config = require("./webpack.config.js"),
	o365 = require("./o365.js"),
	spsave = require('gulp-spsave'),
	browserSync = require('browser-sync').create();

gulp.task("build", ["lint", "webpack:build"]);

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
	console.log(o365);
	return gulp.src('./dist/SiteAssets/**/*')
		.pipe(spsave({
			"username": o365.username,
			"password": o365.password,
			"siteUrl": o365.site,
			"folder": 'SiteAssets'
		}));
});

gulp.task("serve", ["deploy"], function () {
    browserSync.init({
		proxy: {
			target: o365.site,
			proxyRes: [
				function (proxyRes, req, res) {
					console.log(proxyRes.headers);
				}
			]
		},
		https: true
    });

	gulp.watch("./src/**/*.js", ['js-watch']);
});

gulp.task("js-watch", ["deploy"], function (done) {
    browserSync.reload();
    done();
});

// modify some webpack config options
var devConfig = Object.create(config);
devConfig.devtool = "sourcemap";
devConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(devConfig);

gulp.task("webpack:build-dev", function (callback) {
	// run webpack
	devCompiler.run(function (err, stats) {
		if (err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

