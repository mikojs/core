import { Configuration, Project } from '@yarnpkg/core';
import { execute } from '@yarnpkg/shell';

import prettierPackageJson from '..';

test('prettier package json', async () => {
  await prettierPackageJson.hooks.afterAllInstalled(
    new Project(__dirname, new Configuration(__dirname)),
  );

  expect(execute).toHaveBeenCalledTimes(1);
});
