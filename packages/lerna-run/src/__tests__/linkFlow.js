import linkFlow from '../linkFlow';

import symlinkSync from '../utils/symlinkSync';

jest.mock('../utils/symlinkSync', () => jest.fn());

test('link flow', async () => {
  await linkFlow(false);

  expect(symlinkSync).toHaveBeenCalledTimes(4);
  expect(symlinkSync).toHaveBeenCalledWith(
    '/.flowconfig',
    '/package-a/.flowconfig',
    false,
  );
  expect(symlinkSync).toHaveBeenCalledWith(
    '/node_modules/lerna',
    '/package-a/node_modules/lerna',
    false,
  );
  expect(symlinkSync).toHaveBeenCalledWith(
    '/package-b',
    '/package-a/node_modules/@mikojs/package-b',
    false,
  );
  expect(symlinkSync).toHaveBeenCalledWith(
    '/.flowconfig',
    '/package-b/.flowconfig',
    false,
  );
});
