// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

export type entryType = {
  string: [string],
};

export default (dev: boolean, entry: entryType) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'cheap-module-source-map' : false,
  target: 'web',
  optimization: {
    ...(dev
      ? {}
      : {
          minimizer: [
            new TerserPlugin({
              parallel: true,
              sourceMap: false,
              cache: true,
            }),
          ],
        }),
    splitChunks: {
      ...(dev
        ? {}
        : {
            chunks: 'all',
          }),
      cacheGroups: {
        default: false,
        vendors: false,
        ...(dev
          ? {}
          : {
              commons: {
                name: 'commons',
                chunks: 'all',
                minChunks:
                  Object.keys(entry).length > 2
                    ? Object.keys(entry).length * 0.5
                    : 2,
              },
              react: {
                name: 'commons',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              },
            }),
      },
    },
  },
  entry,
  output: {
    path: path.resolve('./public/js'),
    publicPath: '/assets/',
    filename: dev ? '[name].js' : '[name].min.js',
    chunkFilename: dev ? '[name].js' : '[name].min.js',
  },
  plugins: dev
    ? [
        new FriendlyErrorsWebpackPlugin({
          clearConsole: false,
        }),
      ]
    : [],
});
