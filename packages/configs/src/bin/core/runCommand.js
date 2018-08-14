// @flow

import childProcess from 'child_process';

export default ([command, ...args]) => {
  const runCmd = childProcess.spawn(command, args, {
    detached: true,
    stdio: 'inherit',
  });

  runCmd.on('close', exitCode => {
    if (exitCode !== 0) process.exit(1);
  });
};
