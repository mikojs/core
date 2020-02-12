// @flow

import { emptyFunction } from 'fbjs';

import {
  type optionsType,
  type webpackMiddlewarweOptionsType,
} from '@mikojs/koa-react';

/**
 * @example
 * useCss({})
 *
 * @param {optionsType} options - prev @mikojs/koa-react options
 *
 * @return {optionsType} - @mikojs/koa-react options
 */
export default ({
  webpackMiddlewarweOptions: webpackMiddlewarweOptionsFunc = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType = {}): optionsType & {
  webpackMiddlewarweOptions: $NonMaybeType<
    $PropertyType<optionsType, 'webpackMiddlewarweOptions'>,
  >,
} => ({
  ...options,
  webpackMiddlewarweOptions: (
    webpackMiddlewarweOptions: webpackMiddlewarweOptionsType,
    dev: boolean,
  ): webpackMiddlewarweOptionsType => {
    const prevWebpackMiddlewarweOptions = webpackMiddlewarweOptionsFunc(
      webpackMiddlewarweOptions,
      dev,
    );

    if (!prevWebpackMiddlewarweOptions.config.module)
      prevWebpackMiddlewarweOptions.config.module = {};

    if (!prevWebpackMiddlewarweOptions.config.module.rules)
      prevWebpackMiddlewarweOptions.config.module.rules = [];

    prevWebpackMiddlewarweOptions.config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
      ],
    });

    prevWebpackMiddlewarweOptions.config.optimization = {
      ...prevWebpackMiddlewarweOptions.config.optimization,
      splitChunks: {
        ...(prevWebpackMiddlewarweOptions.config.optimization?.splitChunks ||
          {}),
        cacheGroups: {
          ...(
            prevWebpackMiddlewarweOptions.config.optimization?.splitChunks || {}
          ).cacheGroups,
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    return prevWebpackMiddlewarweOptions;
  },
});
