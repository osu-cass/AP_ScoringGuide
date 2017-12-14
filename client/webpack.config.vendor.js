const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bundleOutputDir = "../server/public/client/";
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        resolve: {
            extensions: [ '.js' ]
        },
        module: {
            rules: [
                { test: /\.less$/, use: isDevBuild ? ['style-loader', 'css-loader', 'less-loader'] : ExtractTextPlugin.extract({ use: ['css-loader?minimize', 'less-loader'] }) },
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
                { test: /\.css(\?|$)/, use: extractCSS.extract([ isDevBuild ? 'css-loader' : 'css-loader?minimize' ]) }
            ]
        },
        entry: {
            vendor: [
                "bootstrap",
                "bootstrap/dist/css/bootstrap.css",
                "@osu-cass/sb-components",
                "@osu-cass/sb-components/lib/sb-components.css",
                "font-awesome/css/font-awesome.css",
                "event-source-polyfill",
                "react", 
                "react-dom", 
                "react-router-dom", 
                "jquery"
            ],
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            publicPath: '/client/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            extractCSS,
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.DllPlugin({
                path: path.join(__dirname, bundleOutputDir , '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'node_modules', '@osu-cass/sb-components/lib/Assets/Images'),
                    to: path.join(__dirname, '../server/public', 'Assets/Images')
                }
            ])
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    }];
};
