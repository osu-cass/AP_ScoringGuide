var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.tsx'),

  output: {
    path: path.join(__dirname, "./dist/js"),
    filename: "bundle.js",
    libraryTarget: "var",
    library: "EntryPoint"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],

    modules: [
      path.join(__dirname,'node_modules'),
      path.join(__dirname,'./src')
     ]
  },


  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.js$/, loader: 'babel-loader'},
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: path.join(__dirname, 'tsconfig.json')
        }
      },
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader!less-loader?sourceMap'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },

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