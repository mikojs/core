import { Configuration, Project } from '@yarnpkg/core';
import { execute } from '@yarnpkg/shell';

import pluginPrettierPackageJson from '..';

test('plugin prettier package json', async () => {
  await pluginPrettierPackageJson.hooks.afterAllInstalled(
    new Project(__dirname, new Configuration(__dirname)),
  );

  expect(execute).toHaveBeenCalledTimes(1);
});
