import { execute } from '@yarnpkg/shell';

import { runHook } from '@mikojs/yarn-plugin-utils/lib/testing';

import { hooks } from '..';

test('prettier package json', async () => {
  await runHook(hooks.afterAllInstalled);

  expect(execute).toHaveBeenCalledTimes(1);
});
