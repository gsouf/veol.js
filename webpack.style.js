var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: __dirname + '/src/stylesheets/base.scss',
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("css!sass")

            }
        ]
    },
    sassLoader: {
        outputStyle: 'expanded'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'veol.css'
    },
    plugins: [
        new ExtractTextPlugin("veol.css")
    ]
};
