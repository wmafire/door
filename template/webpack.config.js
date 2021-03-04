const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

var Config = {}
if (process.env.NODE_ENV == "production"){
    let outputPath = path.resolve(__dirname, '../core/resource/template');
    Config = {
        mode : 'production',
        getPageFilename : function (name){
            return './layout/_' + name + '.hbs'
        },
        outputPath: outputPath,
        outputFileName: "./static/assets/[name].js",
        cssFileName: "./static/assets/[name].css",
        copyRules :[
            {
                context: "static",
                from: "**",
                to: outputPath + "/",
            }
        ]
    };
} else {
    let outputPath = path.resolve(__dirname, 'dist');
    Config = {
        mode : 'development',
        getPageFilename : function (name){
            return name + '.html'
        },
        outputPath: outputPath,
        outputFileName: "./assets/[name].js",
        cssFileName: "./assets/[name].css",
        copyRules :[
            {
                context: "static/static",
                from: "**",
                to: outputPath + "/",
            }
        ]
    };
}

function registerPage(config, name) {
  const basePath = "./src";
  const entry = path.resolve(path.resolve(basePath, name), "index.js");
  const page = path.resolve(path.resolve(basePath, name), "index.html");
  config.entry[name] = entry;
  config.plugins.push(
    new HtmlWebpackPlugin({
      // favicon: path.resolve(basePath, "./assets/logo.png"),
      template: page,
      filename: Config.getPageFilename(name),
      chunksSortMode: "auto",
      chunks: [name],
    })
  );
}
var config = {
  mode: Config.mode,
  entry: {},
  output: {
    path: Config.outputPath,
    filename: Config.outputFileName,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: Config.cssFileName,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: Config.copyRules,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true,
  },
};

registerPage(config, "index");
registerPage(config, "tag");
registerPage(config, "archive");
registerPage(config, "post");

module.exports = config;
