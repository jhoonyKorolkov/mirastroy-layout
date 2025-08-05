import { resolve } from "path";
import webpack from "webpack";

export default {
  mode: "production", // или 'development', в зависимости от вашего выбора
  entry: "./src/js/main.js",
  devtool: false,
  output: {
    filename: "main.js",
    path: resolve("dist/js"),
  },
  module: {
    rules: [
      // Убираем правило babel-loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".css"],
  },
  optimization: {
    minimize: false, // если нужно отключить минификацию
  },
  plugins: [
    new webpack.DefinePlugin({
      // ваши глобальные переменные
    }),
  ],
};
