const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const javascript = {
  test: /\.(js)$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel-loader',
};

module.exports = {
  entry: [
    path.resolve(__dirname, '../src/js/index.js'),
    path.resolve(__dirname, '../src/sass/styles.scss'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [javascript],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new CopyPlugin([
      { from: 'src/favicon.ico', to: 'favicon.ico' },
    ]),
  ],
};
