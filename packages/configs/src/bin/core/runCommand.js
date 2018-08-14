// @flow

import childProcess from 'child_process';

export default ([command, ...args]) => {
  const runCmd = childProcess.spawn(command, args);

  runCmd.stdout.on('data', chunk => {
    const str = chunk.toString().replace(/\n$/, '');

    if (str !== '') console.log(str);
  });

  runCmd.stderr.on('data', chunk => {
    const str = chunk.toString().replace(/\n$/, '');

    if (str !== '') console.log(str);
  });

  runCmd.on('close', exitCode => {
    if (exitCode !== 0) process.exit(1);
  });
};
