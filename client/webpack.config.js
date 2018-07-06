const path = require("path");
const webpack = require("webpack");
const TimeFixPlugin = require("time-fix-plugin")
const HTMLPlugin = require("html-webpack-plugin")
const AddHTMLPlugin = require("add-asset-html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const bundleOutputDir = "../server/public/client/";

const vendorFiles = [
  {
    filepath: path.resolve(__dirname, "..", "server", "public", "client", "vendor.js"),
    hash: true,
    includeSourcemap: false
  },
  {
    filepath: path.resolve(__dirname, "..", "server", "public", "client", "vendor.css"),
    typeOfAsset: 'css',
    hash: true,
    includeSourcemap: false
  }
]

module.exports = env => {
  const isDevBuild = (env && env.dev);
  return [
    {
      mode: isDevBuild ? 'development' : 'production',
      entry: path.join(__dirname, "src", "Index.tsx"),

      output: {
        // redirect compiled files into server project
        path: path.resolve(__dirname, bundleOutputDir),
        publicPath: "/client/",
        filename: "bundle.js",
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/main-update.json'
      },

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
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre"
          },
          {
            test: /\.tsx?$/,
            include: /src/,
            use: "ts-loader"
          },
          {
            test: /\.less$/,
            use: isDevBuild
              ? ["style-loader", "css-loader", "less-loader?sourceMap"]
              : [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                "css-loader?minimize",
                "less-loader"
            ]
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
        ]
      },

      plugins: [
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
        new MiniCssExtractPlugin({
          filename: "bundle.css",
          chunkFilename: "[id].css"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require(path.join(
            __dirname,
            bundleOutputDir,
            "vendor-manifest.json"
          ))
        }),
        new HTMLPlugin({
          title: "Smarter Balanced Score Guide",
          template: "index.ejs",
          hash: true,
          filename: path.resolve(__dirname, "..", "server", "public", "index.html")
        }),
        new AddHTMLPlugin( isDevBuild ? vendorFiles[0] : vendorFiles )
      ].concat(
        isDevBuild
          ? [
              // Plugins that apply in development builds only
              new webpack.SourceMapDevToolPlugin({
                moduleFilenameTemplate: path.relative(
                  bundleOutputDir,
                  "[resourcePath]"
                ) // Point sourcemap entries to the original file locations on disk
              }),
              // Temporary workaround for Webpack's infinite HMR loop
              new TimeFixPlugin()
            ]
          : []
      )
    }
  ];
};
