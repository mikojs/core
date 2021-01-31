// @flow

import fs from 'fs';
import path from 'path';

import execa from 'execa';

import version from '../version';

jest.mock('fs');

test('version', async () => {
  execa.mockResolvedValue({
    stdout: '',
  });
  await version('1.15.0');

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    path.resolve('CHANGELOG.md'),
    '',
  );
});
