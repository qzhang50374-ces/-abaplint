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
    // 确保 @abaplint/core 不被拆分到多个 chunk，避免 "duplicate statement syntax handler" 错误
    splitChunks: {
      cacheGroups: {
        // 将 @abaplint 相关模块打包到单独的 vendor chunk
        abaplint: {
          test: /[\\/]node_modules[\\/]@abaplint[\\/]/,
          name: 'abaplint-vendor',
          chunks: 'all',
          enforce: true,
          priority: 20,
        },
        // 其他 vendor 模块
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
    },
    // 确保运行时代码在单独的 chunk 中
    runtimeChunk: 'single',
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
