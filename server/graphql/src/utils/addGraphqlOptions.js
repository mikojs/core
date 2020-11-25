// @flow

import { type defaultOptionsType } from '@mikojs/server/lib/parseArgv';

type commandType = $ElementType<
  $PropertyType<defaultOptionsType, 'commands'>,
  string,
>;

/**
 * @param {commandType} command - prev command
 *
 * @return {commandType} - new command
 */
export default (command: commandType): commandType => ({
  ...command,
  options: [
    ...(command.options || []),
    {
      flags: '--pretty',
      description:
        'a boolean to configure whether the output should be pretty-printed',
    },
    {
      flags: '--graphiql',
      description: 'a boolean to optionally enable GraphiQL mode',
    },
  ],
});
