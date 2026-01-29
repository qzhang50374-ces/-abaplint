/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const isProduction = mode === "production";
  
  return {
    entry: {
      "app": "./src/index.ts",
      "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
      "json.worker": "monaco-editor/esm/vs/language/json/json.worker.js",
    },
    mode,
    output: {
      path: path.join(__dirname, "docs"),
      filename: "[name].bundle.js",
      publicPath: isProduction ? "/-abaplint/" : "/",
      globalObject: "self",
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      open: true,
      hot: true,
    },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "crypto": false,
    },
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      "@abaplint/core": path.resolve(__dirname, "node_modules/@abaplint/core"),
    },
  },
    module: {
      rules: [
        {test: /\.css$/, use: ["style-loader", "css-loader"]},
        {test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"]},
        {
          test: /\.png$/,
          include: /favicon/,
          use: "file-loader?name=[name].[ext]",
        },
        {
          test: /\.png$|\.svg$/,
          exclude: /favicon/,
          use: "url-loader?limit=1024",
        },
        {
          test: /\.ttf$/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  optimization: {
    usedExports: true,
    sideEffects: true,
    // 完全禁用代码拆分，确保所有模块在单一上下文中初始化
    splitChunks: false,
    runtimeChunk: false,
    // 启用模块连接（Scope Hoisting）减少模块边界
    concatenateModules: true,
    // 确保模块 ID 稳定
    moduleIds: 'deterministic',
  },
  plugins: [
    // HtmlWebpackPlugin temporarily disabled due to installation issues
    // new HtmlWebpackPlugin({
    //   template: "public/index.html",
    // }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  };
};
