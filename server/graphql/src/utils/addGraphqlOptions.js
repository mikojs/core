// @flow

import { type defaultOptionsType } from '@mikojs/server/lib/parseArgv';

const newOptions = [
  {
    flags: '--pretty',
    description:
      'a boolean to configure whether the output should be pretty-printed',
  },
  {
    flags: '--graphiql',
    description: 'a boolean to optionally enable GraphiQL mode',
  },
];

/**
 * @param {defaultOptionsType} defaultOptions - default server options
 *
 * @return {defaultOptionsType} - new server options
 */
export default (defaultOptions: defaultOptionsType): defaultOptionsType => ({
  ...defaultOptions,
  commands: {
    ...defaultOptions.commands,
    dev: {
      ...defaultOptions.commands.dev,
      options: [...(defaultOptions.commands.dev.options || []), ...newOptions],
    },
    start: {
      ...defaultOptions.commands.start,
      options: [
        ...(defaultOptions.commands.start.options || []),
        ...newOptions,
      ],
    },
    build: {
      ...defaultOptions.commands.build,
      options: [
        ...(defaultOptions.commands.build.options || []),
        ...newOptions,
      ],
    },
  },
});
