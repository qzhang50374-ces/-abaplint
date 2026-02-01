/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
      // 使用 contenthash 实现长期缓存
      chunkFilename: isProduction ? "[name].[contenthash:8].js" : "[name].js",
      publicPath: isProduction ? "/-abaplint/" : "/",
      globalObject: "self",
      // 清理旧的构建文件
      clean: true,
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
        // 确保 @abaplint/core 只有一个实例
        "@abaplint/core": path.resolve(__dirname, "node_modules/@abaplint/core"),
        "@abaplint/monaco": path.resolve(__dirname, "node_modules/@abaplint/monaco"),
      },
    },
    module: {
      rules: [
        {test: /\.css$/, use: ["style-loader", "css-loader"]},
        {test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"]},
        {
          test: /\.png$/,
          include: /favicon/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.png$|\.svg$/,
          exclude: /favicon/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 1024,
            },
          },
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
          options: {
            // 加速 TypeScript 编译
            transpileOnly: true,
          },
        },
      ],
    },
    optimization: {
      usedExports: true,
      sideEffects: true,
      // 启用模块连接（Scope Hoisting）
      concatenateModules: true,
      moduleIds: 'deterministic',
      // 智能代码分割
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // @abaplint 相关模块打包到一起，避免 duplicate handler 问题
          abaplint: {
            test: /[\\/]node_modules[\\/]@abaplint[\\/]/,
            name: 'abaplint',
            chunks: 'all',
            enforce: true,
            priority: 30,
          },
          // Monaco Editor 核心
          monacoCore: {
            test: /[\\/]node_modules[\\/]monaco-editor[\\/]esm[\\/]vs[\\/](editor|base|platform)[\\/]/,
            name: 'monaco-core',
            chunks: 'all',
            priority: 20,
          },
          // Monaco Editor 语言支持 (按需加载)
          monacoLanguages: {
            test: /[\\/]node_modules[\\/]monaco-editor[\\/]esm[\\/]vs[\\/]language[\\/]/,
            name: 'monaco-languages',
            chunks: 'async',
            priority: 15,
          },
          // 其他 vendor
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      },
      // 运行时代码单独打包
      runtimeChunk: 'single',
      // 配置压缩
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info'] : [],
            },
            mangle: {
              // 只对 @abaplint 保留类名
              keep_classnames: /^(InterfaceDeferred|ClassDeferred|Perform|Call|Move|Loop|Select|Registry|Config|MemoryFile|SyntaxLogic|ABAPFile|ABAPObject|LanguageServer|Issue|Position|Token|Identifier|SpaghettiScope|CurrentScope|TypedIdentifier|AbstractType|Version|Severity|ReferenceType|BuiltIn|Statements|Expressions|Structures|Nodes|Types|BasicTypes|Tokens|Objects)$/,
              keep_fnames: false,
            },
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      // 自动生成 HTML 并注入脚本
      new HtmlWebpackPlugin({
        template: "public/index.html",
        filename: "index.html",
        chunks: ['runtime', 'abaplint', 'monaco-core', 'vendors', 'app'],
        chunksSortMode: 'manual',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        } : false,
      }),
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      // 定义环境变量
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // 忽略 moment.js 的 locale 文件（如果有的话）
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
    // 性能提示
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    // 开发工具
    devtool: isProduction ? false : 'eval-source-map',
  };
};
