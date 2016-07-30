"use strict";

let gulp = require("gulp"),
	gutil = require("gulp-util"),
    tslint = require("gulp-tslint"),
    webpack = require('webpack'),
    server = require("webpack-dev-server"),
    config = require("./webpack.config.js"),
	o365 = require("./o365-johnliu.js"),
	spsync = require('gulp-spsync-creds').sync;


gulp.task("lint", () => {
    return gulp.src("./src/**/*.ts")
        .pipe(tslint({}))
        .pipe(tslint.report("verbose"));
});

gulp.task("default", ["serve"]);

gulp.task("build", ["lint", "webpack:build"]);
//gulp.task('build', ['partials', 'lint', 'webpack:build']);

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

	gulp.src('./dist/**/*')
	.pipe(
		spsync({
			"username": o365.username,
    		"password": o365.password,
    		"site": o365.site 
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

gulp.task("serve", function(callback) {
	// modify some webpack config options
	var serveConfig = Object.create(config);
	serveConfig.devtool = "sourcemap";
	serveConfig.debug = true;

	// Start a webpack-dev-server
	new server(webpack(serveConfig), {
		publicPath: serveConfig.output.publicPath,
		stats: {
			colors: true
		},
		contentBase: "dist"
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("serve", err);
		gutil.log("[serve]", "http://localhost:8080/app.js");
	});
});

