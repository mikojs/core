// @flow

import path from 'path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import { type optionsType } from '../index';

import { type cacheType } from './getCache';

/**
 * @example
 * getConfig('/', optinos, cache, '/client.js', true)
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa react options
 * @param {cacheType} cache - cache data
 * @param {string} clientPath - the client path
 * @param {boolean} dev - dev mode or not
 *
 * @return {object} - webpack config
 */
export default (
  folderPath: string,
  { basename, extensions = /\.js$/, exclude }: optionsType,
  cache: cacheType,
  clientPath: string,
  dev: boolean,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : false,
  entry: {
    [[basename?.replace(/^\//, ''), 'client'].filter(Boolean).join('/')]: [
      'react-hot-loader/patch',
      clientPath,
    ],
  },
  output: {
    path: dev ? undefined : path.resolve('./public/js'),
    publicPath: dev ? '/assets/' : '/public/js/',
    filename: dev ? '[name].js' : '[name].[chunkhash:8].min.js',
    chunkFilename: dev ? '[name].js' : '[name].[chunkhash:8].min.js',
  },
  optimization: {
    minimize: !dev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: [basename?.replace(/^\//, ''), 'commons']
            .filter(Boolean)
            .join('/'),
          chunks: 'all',
          minChunks:
            cache.routesData.length > 2 ? cache.routesData.length * 0.5 : 2,
        },
      },
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      BROWSER: true,
    }),
    new ProgressBarPlugin(),
  ],
  module: {
    rules: [
      {
        test: extensions,
        include: [clientPath, folderPath],
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
});
