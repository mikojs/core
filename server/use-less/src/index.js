// @flow

import { emptyFunction } from 'fbjs';
import { type RuleSetRule as RuleSetRuleType } from 'webpack';

import { type optionsType, type configType } from '@cat-org/koa-react';

export default ({
  config: configFunc = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType = {}): optionsType & {
  config: $NonMaybeType<$PropertyType<optionsType, 'config'>>,
} => ({
  ...options,
  config: (config: configType, dev: boolean): configType => {
    const prevConfig = configFunc(config, dev);
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    const cssLoader = prevConfig.config.module?.rules?.find(
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      ({ test }: RuleSetRuleType) => test?.toString() === /\.css$/.toString(),
    );

    if (!cssLoader || !(cssLoader.use instanceof Array))
      throw new Error(
        'You should use `@cat-org/use-css` before using `@cat-org/use-less`',
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
