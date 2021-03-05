// @flow

import crypto from 'crypto';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @param {string} command - command string
 *
 * @return {commandsType} - commands array
 */
const getCommands = (command: string): commandsType => {
  const pattern = command.match(/["'].+['"]/);
  const commands = (!pattern
    ? command
    : command.replace(
        pattern[0],
        crypto.createHash('md5').update(pattern[0]).digest('hex'),
      )
  ).split('[ ]*&&[ ]*');

  return commands.map((str: string) => str.split(/[ ]+/));
};

export default getCommands;
