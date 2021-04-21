import fs from 'fs';
import path from 'path';

import pluginPrettierPackageJson from '..';

jest.mock('fs');

test('plugin prettier package json', async () => {
  await pluginPrettierPackageJson.factory().hooks.afterAllInstalled({
    workspaces: [
      {
        cwd: path.resolve(__dirname, '../..'),
      },
    ],
  });

  expect(fs.readFileSync).toHaveBeenCalledTimes(1);
  expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
});
