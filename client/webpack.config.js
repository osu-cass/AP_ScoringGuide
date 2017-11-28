const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = "../server/public/client/";
module.exports = {
  entry: path.join(__dirname, 'src', 'Index.tsx'),

  output: {
    // redirect compiled files into server project
    path: path.join(__dirname,bundleOutputDir ),
    publicPath: "/client/",
    filename: "bundle.js"
  },

  devServer: {
    port: 8080,
    quiet: true,
    noInfo: true,
    proxy: {
      "/": "http://localhost:3000/"
    },
    hot: true
  },

  devtool: '#source-map',
  
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
        loaders: ["react-hot-loader/webpack", "awesome-typescript-loader"]
        //options: {configFileName: 'tsconfig.json'}
      },
      {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!less-loader?sourceMap",
          disable: process.env.NODE_ENV !== "production"
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
    new ExtractTextPlugin("bundle.css"),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CheckerPlugin(),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(path.join(__dirname, bundleOutputDir , 'vendor-manifest.json'))
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "source-map";
}
