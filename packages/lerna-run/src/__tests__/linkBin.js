import linkBin from '../linkBin';

import symlinkSync from '../utils/symlinkSync';

jest.mock('../utils/symlinkSync', () => jest.fn());

test('link bin', async () => {
  await linkBin(false);

  expect(symlinkSync).toHaveBeenCalledTimes(1);
  expect(symlinkSync).toHaveBeenCalledWith(
    '/package-a/lib/bin/index.js',
    '/node_modules/.bin/package-a',
    false,
  );
});
