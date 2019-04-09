// @flow

import { emptyFunction } from 'fbjs';

/** mock execa */
class Execa {
  mainFunction = emptyFunction.thatReturnsArgument;

  cmds = [];

  main = {
    shell: (
      cmd: string,
    ): Promise<{|
      stdout: string,
    |}> => {
      const stdout = this.mainFunction(cmd);

      this.cmds.push(cmd);
      return Promise.resolve({
        stdout,
      });
    },
  };
}

export const execa = new Execa();
export default execa.main;
