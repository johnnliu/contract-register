var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  cache: true,
  entry: {
    app: ['./src/index.js'],
    vendor: ['es6-promise', 'whatwg-fetch', 'jquery', 'angular', 'kendo', 'sp-pnp-js', './lib/angular-kendo-window.js' /*, 'kendo/css/web/kendo.common-office365.css', 'kendo/css/web/kendo.office365.css'*/]
  },
  output: {
    path: path.join(__dirname, 'dist/SiteAssets'),
    publicPath: '../SiteAssets/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  externals: {
    'jquery': 'jQuery',
    'angular': 'angular',
    'kendo': 'kendo',
    '_spPageContextInfo': '_spPageContextInfo',
    'node-fetch': '{}'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js'),
    /*
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery'
    }),
    */
    new HtmlWebpackPlugin({
      filename: 'SPApp.html',
      template: './src/sp-app.ejs',
      inject: false
    }),
    /*
    new webpack.SourceMapDevToolPlugin({
      //filename: '[file].map',
      exclude: ['vendor.js'],
      //columns: false, // no columns in SourceMaps
      //module: true // true // use SourceMaps from loaders 
    })
    */
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      //{ test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.css$/, loaders: ['style', 'css'] },
      { test: /\.(jpg|gif|png)/, loader: 'url-loader?limit=100000' },
      { test: /\.(svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?/i, loader: 'url-loader' },
      { test: /\.html$/, loader: 'html' }
    ]
  },
  devtool: 'source-map'
};
