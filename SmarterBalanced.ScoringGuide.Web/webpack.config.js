﻿var path = require('path');

module.exports = {
  entry: {
    "sb.scoringguide.index": "./Scripts/index.tsx"
  },

  output: {
    path: path.join(__dirname, 'wwwroot/js/'),
    filename: "[name].js",
    libraryTarget: "var",
    library: "EntryPoint"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        { test: /\.tsx?$/, loader: "awesome-typescript-loader", options: { configFileName: path.join(__dirname, 'Scripts/tsconfig.json') } },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "jquery": "jQuery"
  }
};