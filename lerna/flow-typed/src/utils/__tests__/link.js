// @flow

import fs from 'fs';
import path from 'path';

import link from '../link';

jest.mock('fs');

test('link', async () => {
  const flowconfig = path.resolve('.flowconfig');

  // $FlowFixMe jest mock
  fs.existsSync.mockImplementation((filePath: string) =>
    /__mocks__/.test(filePath),
  );

  expect(await link(false)).toBeUndefined();
  expect(fs.symlinkSync).toHaveBeenCalledTimes(1);
  expect(fs.symlinkSync).toHaveBeenCalledWith(flowconfig, flowconfig);
});
