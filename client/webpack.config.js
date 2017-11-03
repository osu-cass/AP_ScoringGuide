const path = require('path');
﻿const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/bundle.js",
    libraryTarget: "var",
    library: "EntryPoint"
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "jquery": "jQuery"
  },

  // Enable sourcemaps for debugging webpack's output.
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],

    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, './src')
    ]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.js$/, loader: 'babel-loader' },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {configFileName: './tsconfig.json'}
      },
      {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!less-loader?sourceMap"
        })
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=images/[name].[ext]"},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  plugins: [
    new ExtractTextPlugin("css/site.css"),
    new HtmlWebpackPlugin({
     title: 'Scoring Guide',
     template: './src/index.ejs',
     inject: 'body'
   })
  ]
};

if(process.env.NODE_ENV === "development"){
  //load styles from from git submodule
  module.exports.devtool = "source-map";
}
