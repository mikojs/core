// @flow

import execa from 'execa';

import { type commandsType } from './getCommands';

/**
 * @param {commandsType} commands - commands array
 */
export default async (commands: commandsType) => {
  await commands.reduce(
    async (
      result: Promise<void>,
      command: $ElementType<commandsType, number>,
    ) => {
      await result;
      await execa(command[0], command.slice(1), {
        stdio: 'inherit',
        env: {},
      });
    },
    Promise.resolve(),
  );
};
