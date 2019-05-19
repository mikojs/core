// @flow

import { emptyFunction } from 'fbjs';

import { type optionsType, type configType } from '@cat-org/react-middleware';

if (typeof require !== 'undefined')
  // $FlowFixMe TODO: use @cat-org/babel-plugin-import-css to transform
  require.extensions['.less'] = emptyFunction;

export default ({
  config: configFunc = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType = {}): optionsType & {
  config: $NonMaybeType<$PropertyType<optionsType, 'config'>>,
} => ({
  ...options,
  config: (config: configType, dev: boolean): configType => {
    const prevConfig = configFunc(config, dev);
    const cssLoader = prevConfig.config.module?.rules.find(
      ({ test }: { test: RegExp }) => test.toString() === /\.css$/.toString(),
    );

    if (!cssLoader)
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
            ...(prevConfig.config.optimization?.splitChunks || {}).cacheGroups
              ?.styles,
            test: /\.(css|less)$/,
          },
        },
      },
    };

    return prevConfig;
  },
});
