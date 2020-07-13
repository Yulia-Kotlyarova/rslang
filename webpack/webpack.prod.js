const path = require('path');
const glob = require('glob-all');

const merge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const common = require('./webpack.common.js');

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: [autoprefixer()],
  },
};

const stylesSCSS = {
  test: /\.(scss)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    }, {
      loader: 'css-loader',
      options: {
        url: false,
      },
    }, postcss, {
      loader: 'sass-loader',
    },
  ],
};

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
    ],
  },
  module: {
    rules: [stylesSCSS],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new PurgecssPlugin({
      paths: glob.sync([
        path.join(__dirname, '../src/**/*.html'),
        path.join(__dirname, '../src/**/*.js'),
      ]),
      safelist: [],
    }),
  ],
});
