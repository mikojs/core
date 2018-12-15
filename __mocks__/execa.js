// @flow

import { emptyFunction } from 'fbjs';

/** mock execa */
class Execa {
  mainFunction = emptyFunction;

  main = {
    shell: (
      cmd: string,
    ): {
      stdout: string,
    } => {
      this.mainFunction();
      this.mainFunction = emptyFunction;

      return {
        stdout: cmd,
      };
    },
  };
}

export const execa = new Execa();
export default execa.main;
