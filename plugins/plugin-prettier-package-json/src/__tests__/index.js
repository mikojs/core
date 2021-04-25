import path from 'path';

import { execute } from '@yarnpkg/shell';

import pluginPrettierPackageJson from '..';

test('plugin prettier package json', async () => {
  await pluginPrettierPackageJson.factory().hooks.afterAllInstalled({
    workspaces: [
      {
        cwd: path.resolve(__dirname, '../..'),
      },
    ],
  });

  expect(execute).toHaveBeenCalledTimes(1);
});
