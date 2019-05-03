// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';

import { type dataType } from './getData';

const CLIENT_PATH = path.resolve(__dirname, './client.js');
const ROOT_PATH = path.resolve(__dirname, './Root.js');

export default (
  dev: boolean,
  folderPath: string,
  basename: ?string,
  { routesData, templates }: dataType,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : false,
  entry: !basename
    ? {
        client: [CLIENT_PATH],
      }
    : {
        [`${basename.replace(/^\//, '')}/client`]: [CLIENT_PATH],
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
          name: !basename
            ? 'commons'
            : `${basename.replace(/^\//, '')}/commons`,
          chunks: 'all',
          minChunks: routesData.length > 2 ? routesData.length * 0.5 : 2,
        },
      },
    },
  },
  module: {
    rules: [
      {
        include: [CLIENT_PATH],
        loader: path.resolve(__dirname, './replaceLoader.js'),
        options: {
          type: 'routers',
          routers: {
            routesData: `[${routesData
              .map(
                ({
                  routePath,
                  chunkName,
                  filePath,
                }: $ElementType<
                  $PropertyType<dataType, 'routesData'>,
                  number,
                >): string =>
                  `{ ${[
                    'exact: true',
                    `path: ${JSON.stringify(routePath)}`,
                    `component: { ${[
                      `loader: () => import(/* webpackChunkName: "${chunkName}" */ '${filePath}')`,
                      `chunkName: '${chunkName}'`,
                    ].join(', ')} }`,
                  ].join(', ')} }`,
              )
              .join(', ')}] ||`,
            main: templates.main,
            loading: templates.loading,
            error: templates.error,
          },
        },
      },
      ...(!dev
        ? []
        : [
            {
              include: [CLIENT_PATH],
              loader: path.resolve(__dirname, './replaceLoader.js'),
              options: {
                type: 'set-config',
              },
            },
            {
              include: [folderPath, ROOT_PATH],
              loader: path.resolve(__dirname, './replaceLoader.js'),
              options: {
                type: 'react-hot-loader',
              },
            },
            {
              test: /\.jsx?$/,
              include: /node_modules/,
              use: ['react-hot-loader/webpack'],
            },
          ]),
    ],
  },
});
