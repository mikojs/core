// @flow

import path from 'path';

export const getPackagesSync: JestMockFn<
  $ReadOnlyArray<void>,
  $ReadOnlyArray<{| name: string, manifestLocation: string |}>,
> = jest.fn().mockReturnValue([
  {
    name: '@mikojs/core',
    manifestLocation: path.resolve('package.json'),
  },
]);

export default (jest.fn(): JestMockFn<$ReadOnlyArray<void>, void>);
