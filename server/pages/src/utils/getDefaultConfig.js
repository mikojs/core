// @flow

import path from 'path';

import { type WebpackOptions as WebpackOptionsType } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import { type optionsType as serverOptionsType } from '@mikojs/server';

import { type routesType } from '../index';

export type optionsType = {|
  ...serverOptionsType,
  dev?: $PropertyType<serverOptionsType, 'dev'>,
  extensions?: $PropertyType<serverOptionsType, 'extensions'>,
|};

/**
 * @param {routesType} routes - routes
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 * @param {string} chunkHash - chunk hash
 * @param {string} clientName - client name
 * @param {string} clientPath - client path
 * @param {string} commonsName - commons name
 *
 * @return {WebpackOptionsType} - webpack default config
 */
export default (
  routes: routesType,
  folderPath: string,
  options: optionsType,
  chunkHash: string,
  clientName: string,
  clientPath: string,
  commonsName: string,
): WebpackOptionsType => {
  const { dev = process.env.NODE_ENV !== 'production', extensions } = options;

  return {
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'eval' : false,
    entry: {
      [clientName]: ['react-hot-loader/patch', clientPath],
    },
    output: {
      path: dev ? undefined : path.resolve('./public/js'),
      publicPath: dev ? '/assets/' : '/public/js/',
      filename: dev ? '[name].js' : `[name].${chunkHash}.min.js`,
      chunkFilename: dev ? '[name].js' : `[name].${chunkHash}.min.js`,
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
            name: commonsName,
            chunks: 'all',
            minChunks: routes.get().length > 2 ? routes.get().length : 2,
          },
        },
      },
    },
    plugins: [new ProgressBarPlugin()],
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
  };
};
