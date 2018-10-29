// @flow

import { emptyFunction } from 'fbjs';

/** mock execa */
class Execa {
  cmds = [];

  mainFunction = emptyFunction;

  main = {
    shell: (cmd: string) => {
      this.mainFunction();
      this.mainFunction = emptyFunction;
      this.cmds.push(cmd);
    },
  };
}

export const execa = new Execa();
export default execa.main;
