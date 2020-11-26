// @flow

import { type optionsType } from '@mikojs/commander';
import { type defaultOptionsType } from '@mikojs/server/lib/parseArgv';

import { type optionsType as graphqlOptionsType } from '../index';

type commandOptionsType = {|
  ...defaultOptionsType,
  version: string,
|};

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

export const graphqlOptionKeys: $ReadOnlyArray<$Keys<graphqlOptionsType>> = [
  'pretty',
  'graphiql',
];

/**
 * @param {commandOptionsType} commandOptions - default command options
 *
 * @return {optionsType} - new command options
 */
export default (commandOptions: commandOptionsType): optionsType => ({
  ...commandOptions,
  commands: {
    ...commandOptions.commands,
    dev: {
      ...commandOptions.commands.dev,
      options: [...(commandOptions.commands.dev.options || []), ...newOptions],
    },
    start: {
      ...commandOptions.commands.start,
      options: [
        ...(commandOptions.commands.start.options || []),
        ...newOptions,
      ],
    },
    build: {
      ...commandOptions.commands.build,
      options: [
        ...(commandOptions.commands.build.options || []),
        ...newOptions,
      ],
    },
  },
});
