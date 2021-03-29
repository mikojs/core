// @flow

import execa from 'execa';

import runCommands from '../runCommands';

test('run commands', async () => {
  await runCommands([['command', 'options']]);

  expect(execa).toHaveBeenCalledTimes(1);
  expect(execa).toHaveBeenCalledWith('command', ['options'], {
    stdio: 'inherit',
    env: {},
  });
});
