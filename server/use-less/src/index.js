// @flow

import { invariant, emptyFunction } from 'fbjs';
import { type RuleSetRule as RuleSetRuleType } from 'webpack';

import {
  type optionsType,
  type webpackMiddlewarweOptionsType,
} from '@mikojs/koa-react';

/**
 * @example
 * useLess({})
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
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    const cssLoader = prevWebpackMiddlewarweOptions.config.module?.rules?.find(
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      ({ test }: RuleSetRuleType) => test?.toString() === /\.css$/.toString(),
    );

    invariant(
      cssLoader && cssLoader.use instanceof Array,
      'You should use `@mikojs/use-css` before using `@mikojs/use-less`',
    );

    cssLoader.test = /\.(css|less)$/;
    cssLoader.use.push({
      loader: 'less-loader',
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
            test: /\.(css|less)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    return prevWebpackMiddlewarweOptions;
  },
});
