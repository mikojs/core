// @flow

import crypto from 'crypto';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @param {string} commandStr - command string
 *
 * @return {commandsType} - commands array
 */
const getCommands = (commandStr: string): commandsType =>
  commandStr
    .replace(/["'].+['"]/, (str: string, p1: string) =>
      str.replace(p1, crypto.createHash('md5').update(p1).digest('hex')),
    )
    .split('[ ]*&&[ ]*')
    .map((str: string) => str.split(/[ ]+/));

export default getCommands;
