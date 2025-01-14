const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "inline-source-map",
    entry: {
      popup: "./popup.js",
      background: "./background.js",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: !isProduction,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    plugins: [
      new Dotenv({
        path: "./.env",
        systemvars: true,
        safe: false, // Set to false if you don't have a .env.example
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new CopyPlugin({
        patterns: [
          { from: "public/manifest.json", to: "manifest.json" },
          { from: "src/data", to: "data", noErrorOnMissing: true },
          { from: "public/icons", to: "icons" },
          { from: "src/styles.css", to: "styles.css" },
        ],
      }),
    ],
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
