const merge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

const stylesSCSS = {
  test: /\.(scss)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        url: false,
      },
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
  },
  devtool: 'inline-cheap-source-map',
  module: {
    rules: [stylesSCSS],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
});
