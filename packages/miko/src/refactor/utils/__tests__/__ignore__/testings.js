// @flow

import { type commandsType } from '../../getCommands';

export type testingType = [string, commandsType];

export default ([
  ['miko miko', [['command']]],
  ['miko miko miko', [['command']]],
  ['miko miko -a', [['command', '-a']]],
  ['miko miko "miko miko" -a', [['command', '"command"', '-a']]],
  ['miko miko "miko miko -a" -a', [['command', '"command -a"', '-a']]],
  ['miko miko && miko miko', [['command'], ['command']]],
  [
    'miko miko "miko miko && miko miko" -a',
    [['command', '"command && command"', '-a']],
  ],
  [
    `miko miko "miko miko 'miko miko && miko miko' -a" -a`,
    [['command', `"command 'command && command' -a"`, '-a']],
  ],
]: $ReadOnlyArray<testingType>);
