"use strict";

let gulp = require("gulp"),
	gutil = require("gulp-util"),
    eslint = require("gulp-eslint"),
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    config = require("./webpack.config.js"),
	user = require("./user.js"),
	spsave = require("gulp-spsave");

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

	return gulp.src('./dist/SiteAssets/**/*')
		.pipe(spsave({
			"username": user.username,
			"password": user.password,
			"siteUrl": user.site,
			"folder": 'SiteAssets'
		}));
});
