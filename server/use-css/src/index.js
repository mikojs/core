// @flow

import { emptyFunction } from 'fbjs';

import { type optionsType, type configType } from '@cat-org/react-middleware';

export default ({
  config: configFunc = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType = {}): optionsType & {
  config: $NonMaybeType<$PropertyType<optionsType, 'config'>>,
} => ({
  ...options,
  config: (config: configType, dev: boolean): configType => {
    const prevConfig = configFunc(config, dev);

    if (!prevConfig.config.module) prevConfig.config.module = {};

    if (!prevConfig.config.module.rules) prevConfig.config.module.rules = [];

    prevConfig.config.module.rules.push({
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

    prevConfig.config.optimization = {
      ...prevConfig.config.optimization,
      splitChunks: {
        ...(prevConfig.config.optimization?.splitChunks || {}),
        cacheGroups: {
          ...(prevConfig.config.optimization?.splitChunks || {}).cacheGroups,
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    return prevConfig;
  },
});
