const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, options) => {
  return {
    entry: ["./src/index.js"],
    output: {
      path: path.resolve(__dirname, "build"),
      publicPath: "/",
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.jsx$|\.es6$|\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["react"],
            },
          },
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.css$|\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            "resolve-url-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                // sourceMapContents: false,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico|woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          exclude: /node_modules/,
          use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src/"),
        // assets: path.resolve(__dirname, "src/assets/"),
      },
    },
    devServer: {
      historyApiFallback: true,
    },
    externals: {
      // global app config object
      config: JSON.stringify({
        // apiUrl: "http://192.168.1.111:3021", //local url
        apiUrl: "http://localhost:3034", //local url
        // apiUrl: "http://192.168.1.26:3034", //local url
        // apiUrl: "http://194.233.89.164:3034", //CONTABO API Server
      }),
    },
  };
};


