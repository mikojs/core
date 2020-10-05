// @flow

import path from 'path';

import { requireModule } from '@mikojs/utils';

import { type middlewareType } from '../../index';
import testingServer, { type fetchResultType } from '../../testingServer';

/** */
export default () => {
  beforeAll(async () => {
    await testingServer.run(
      requireModule<middlewareType<void>>(path.resolve(__dirname, './foo')),
    );
  });

  test('fetch', async () => {
    expect(
      await testingServer.fetch('/').then((res: fetchResultType) => res.text()),
    ).toBe('/');
  });

  afterAll(() => {
    testingServer.close();
  });
};
