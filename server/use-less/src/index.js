// @flow

import { invariant, emptyFunction } from 'fbjs';
import { type RuleSetRule as RuleSetRuleType } from 'webpack';

import { type optionsType, type configType } from '@mikojs/koa-react';

/**
 * @example
 * useLess({})
 *
 * @param {optionsType} config - prev @mikojs/koa-react config
 *
 * @return {optionsType} - @mikojs/koa-react config
 */
export default ({
  config: configFunc = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType = {}): optionsType & {
  config: $NonMaybeType<$PropertyType<optionsType, 'config'>>,
} => ({
  ...options,
  config: (config: configType, dev: boolean): configType => {
    const prevConfig = configFunc(config, dev);
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    const cssLoader = prevConfig.config.module?.rules?.find(
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

    prevConfig.config.optimization = {
      ...prevConfig.config.optimization,
      splitChunks: {
        ...(prevConfig.config.optimization?.splitChunks || {}),
        cacheGroups: {
          ...(prevConfig.config.optimization?.splitChunks || {}).cacheGroups,
          styles: {
            name: 'styles',
            test: /\.(css|less)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    return prevConfig;
  },
});
