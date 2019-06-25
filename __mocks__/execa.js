// @flow

import { emptyFunction } from 'fbjs';

/** mock execa */
class Execa {
  mainFunction = emptyFunction.thatReturnsArgument;

  cmds = [];

  +main = (
    cmd: string,
    args: $ReadOnlyArray<string> = [],
  ): Promise<{|
    stdout: string,
  |}> => {
    const command = [cmd, ...args].join(' ');
    const stdout = this.mainFunction(command);

    this.cmds.push(command);
    return Promise.resolve({
      stdout,
    });
  };
}

export const execa = new Execa();
export default execa.main;
