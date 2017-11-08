const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, './src/index.tsx'),

  output: {
    // redirect compiled files into server project
    path: path.join(__dirname, "../server/public/client/"),
    publicPath: "/client/",
    filename: "bundle.js"
  },

  devServer: {
    port: 8080,
    quiet: true,
    noInfo: true,
    proxy: {
      "/": "http://localhost:3000/"
    }
  },

  devtool: '#source-map',

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "jquery": "jQuery"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, './src')
    ]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
        //options: {configFileName: 'tsconfig.json'}
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
      { test: /\.(jpe?g|png|gif)$/i, loader: "file-loader?name=images/[name].[ext]"}

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      //{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  plugins: [
    new ExtractTextPlugin("bundle.css")
  ]
};

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "source-map";
}
