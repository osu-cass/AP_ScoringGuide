const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const bundleOutputDir = "../server/public/client/";
module.exports = env => {
  const isDevBuild = !(env && env.prod);

  return [
    {
      entry: path.join(__dirname, "src", "Index.tsx"),

      output: {
        // redirect compiled files into server project
        path: path.join(__dirname, bundleOutputDir),
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

      devtool: "#source-map",

      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        modules: [
          path.join(__dirname, "node_modules"),
          path.join(__dirname, "./src")
        ]
      },

      module: {
        rules: [
          {
            test: /\.tsx?$/,
            include: /src/,
            use: "ts-loader"
          },
          {
            test: /\.less$/,
            use: isDevBuild
              ? ["style-loader", "css-loader", "less-loader?sourceMap"]
              : ExtractTextPlugin.extract({
                  use: ["css-loader?minimize", "less-loader"]
                })
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader"
          },
          {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader"
          },
          {
            test: /\.(jpe?g|png|gif)$/i,
            loader: "file-loader?name=images/[name].[ext]"
          }

          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          //{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
      },

      plugins: [
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
        new ExtractTextPlugin("bundle.css"),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require(path.join(
            __dirname,
            bundleOutputDir,
            "vendor-manifest.json"
          ))
        })
      ]
    }
  ];
};
