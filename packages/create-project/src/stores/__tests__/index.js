// @flow

// $FlowFixMe jest mock
import { execa } from 'execa';

import Store from '../index';

test('store with execa error', async () => {
  /** example store */
  class Example extends Store {}

  const example = new Example();

  example.run({ projectDir: 'project dir', check: false });
  execa.mainFunction = () => {
    throw new Error('command error');
  };

  await expect(example.execa('command error')).rejects.toThrow('process exit');
});
