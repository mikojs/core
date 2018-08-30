// @flow

import childProcess from 'child_process';

// $FlowFixMe
export default ([command, ...args]: $ReadOnlyArray<string>) => {
  const runCmd = childProcess.spawn(command, args, {
    detached: true,
    stdio: 'inherit',
  });

  runCmd.on('close', (exitCode: number) => {
    if (exitCode !== 0) process.exit(1);
  });
};
