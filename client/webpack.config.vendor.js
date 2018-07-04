const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const bundleOutputDir = "../server/public/client/";

module.exports = env => {
  const isDevBuild = (env && env.dev);
  return [
    {
      mode: isDevBuild ? 'development' : 'production',
      stats: {
        modules: false
      },
      resolve: {
        extensions: [".js", ".less", ".css"]
      },
      module: {
        rules: [
          {
            test: /\.(css|less)$/,
            use: isDevBuild 
              ? ["style-loader", "css-loader", "less-loader"]
              : [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                "css-loader?minimize",
                "less-loader"
              ]
          },
          {
            test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
            use: "url-loader?limit=100000"
          }
        ]
      },
      entry: {
        vendor: [
          "bootstrap",
          "bootstrap/less/bootstrap.less",
          "font-awesome/less/font-awesome.less",
          "event-source-polyfill",
          "isomorphic-fetch",
          "react",
          "react-dom",
          "react-router-dom",
          "react-modal",
          "jquery",
          "typeface-pt-sans-caption/index.css",
          "typeface-pt-serif/index.css",
          "typeface-pt-serif-caption/index.css",
          "es6-promise"
        ]
      },
      output: {
        path: path.join(__dirname, bundleOutputDir),
        publicPath: "/client/",
        filename: "[name].js",
        library: "[name]_[hash]"
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: "vendor.css",
          chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
        new webpack.DllPlugin({
          path: path.join(__dirname, bundleOutputDir, "[name]-manifest.json"),
          name: "[name]_[hash]"
        }),
        new webpack.EnvironmentPlugin({
          "NODE_ENV": isDevBuild ? '"development"' : '"production"'
        }),
        new CopyWebpackPlugin([
          {
            from: path.join(
              __dirname,
              "node_modules",
              "@sbac/sbac-ui-kit/src/images"
            ),
            to: path.join(__dirname, "../server/public", "Assets/Images")
          }
        ])
      ]
    }
  ];
};
