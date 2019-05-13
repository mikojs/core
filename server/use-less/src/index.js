// @flow

import { emptyFunction } from 'fbjs';

import { type optionsType } from '@cat-org/react-middleware';
import { type configType } from '@cat-org/react-middleware/lib/utils/buildJs';

export default ({
  config: configFunc = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType): optionsType => ({
  ...options,
  config: (config: configType, dev: boolean): configType => {
    const prevConfig = configFunc(config, dev);

    if (!prevConfig.config.module) prevConfig.config.module = {};

    if (!prevConfig.config.module.rules) prevConfig.config.module.rules = [];

    prevConfig.config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
        },
      ],
    });

    return prevConfig;
  },
});
