const path = require('path');

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const javascript = {
  test: /\.(js)$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel-loader',
};

module.exports = {
  entry: {
    audioCall: path.resolve(__dirname, '../src/js/blocks/AudioCall/audioCall.js'),
    authorization: path.resolve(__dirname, '../src/js/blocks/Authorization/authorization.js'),
    cards: path.resolve(__dirname, '../src/js/blocks/Cards/cards.js'),
    dictionary: path.resolve(__dirname, '../src/js/blocks/Dictionary/dictionary.js'),
    index: path.resolve(__dirname, '../src/js/blocks/Index/index.js'),
    promo: path.resolve(__dirname, '../src/js/blocks/Promo/promo.js'),
    puzzle: path.resolve(__dirname, '../src/js/blocks/Puzzle/puzzle.js'),
    savannah: path.resolve(__dirname, '../src/js/blocks/Savannah/savannah.js'),
    speakIt: path.resolve(__dirname, '../src/js/blocks/SpeakIt/speakIt.js'),
    sprint: path.resolve(__dirname, '../src/js/blocks/Sprint/sprint.js'),
    statistics: path.resolve(__dirname, '../src/js/blocks/Statistics/statistics.js'),
    team: path.resolve(__dirname, '../src/js/blocks/Team/team.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [javascript],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!files*', '!files/*.jpg', '!files/*.mp3'],
    }),

    new HtmlWebpackPlugin({
      filename: '../dist/audioCall.html',
      template: path.resolve(__dirname, '../src/audioCall.html'),
      chunks: ['audioCall'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/authorization.html',
      template: path.resolve(__dirname, '../src/authorization.html'),
      chunks: ['authorization'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/dictionary.html',
      template: path.resolve(__dirname, '../src/dictionary.html'),
      chunks: ['dictionary'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/cards.html',
      template: path.resolve(__dirname, '../src/cards.html'),
      chunks: ['cards'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/index.html',
      template: path.resolve(__dirname, '../src/index.html'),
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/puzzle.html',
      template: path.resolve(__dirname, '../src/puzzle.html'),
      chunks: ['puzzle'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/promo.html',
      template: path.resolve(__dirname, '../src/promo.html'),
      chunks: ['promo'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/savannah.html',
      template: path.resolve(__dirname, '../src/savannah.html'),
      chunks: ['savannah'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/speakIt.html',
      template: path.resolve(__dirname, '../src/speakIt.html'),
      chunks: ['speakIt'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/sprint.html',
      template: path.resolve(__dirname, '../src/sprint.html'),
      chunks: ['sprint'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/statistics.html',
      template: path.resolve(__dirname, '../src/statistics.html'),
      chunks: ['statistics'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/team.html',
      template: path.resolve(__dirname, '../src/team.html'),
      chunks: ['team'],
    }),

    new CopyPlugin([
      { from: 'src/favicon.ico', to: 'favicon.ico' },
      { from: 'src/icons', to: 'icons' },
      { from: 'src/assets/', to: '' },
    ]),
  ],
};
