// @flow

import { emptyFunction } from 'fbjs';

/** mock execa */
class Execa {
  mainFunction = emptyFunction.thatReturnsArgument;

  cmds = [];

  main = {
    shell: (
      cmd: string,
    ): {
      stdout: string,
    } => {
      const stdout = this.mainFunction(cmd);

      this.mainFunction = emptyFunction.thatReturnsArgument;
      this.cmds.push(cmd);

      return {
        stdout,
      };
    },
  };
}

export const execa = new Execa();
export default execa.main;
