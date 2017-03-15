var webpack = require('webpack');
var path = require('path');


var libraryName = 'Veol';
var outputFile = libraryName.toLowerCase();
var env = process.env.WEBPACK_ENV;
var IS_DEV = "prod" !== env;

var plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + env + '"'
      }
    })
];

if (!IS_DEV) {
  var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile += '.min.js';
  inputFile = __dirname + '/src/javascripts/index.js';
} else {
  outputFile += '.test.js';
  inputFile = __dirname + '/src/javascripts/index.test.js';
}

var config = {
  entry: inputFile,
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ]

  },

  resolve: {
    root: path.resolve('./src/javascripts'),
    extensions: ['', '.js']
  },
  plugins: plugins
};


if(process.env.WEBPACK_EXPORT_CSS){
    var exports = [config];
    exports.push(require('./webpack.style.js'));
    module.exports = exports;
}else{
    // Needs to be a single config (not an array of configs) when working with karma
    module.exports = config;
}
