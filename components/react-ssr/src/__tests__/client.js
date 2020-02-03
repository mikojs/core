// @flow

import client from '../client';

import testings, {
  Main,
  Loading,
  ErrorComponent,
  chunkName,
  routesData,
} from './__ignore__/testings';

describe('client', () => {
  test('work', async () => {
    const main = global.document.createElement('main');
    const mockLog = jest.fn();

    main.setAttribute('id', '__MIKOJS__');
    main.innerHTML = testings;
    global.document.querySelector('body').appendChild(main);
    global.window.__MIKOJS_DATA__ = {
      mainInitialProps: {},
      pageInitialProps: {},
      chunkName,
    };
    global.console.error = mockLog;

    await client({
      Main,
      Loading,
      Error: ErrorComponent,
      routesData,
    });

    expect(mockLog).not.toHaveBeenCalled();
  });

  test('not find page component', async () => {
    await expect(
      client({
        Main,
        Loading,
        Error: ErrorComponent,
        routesData: [],
      }),
    ).rejects.toThrow('Can not find page component');
  });

  test('not find main HTMLElement', async () => {
    global.document.getElementById('__MIKOJS__').remove();

    await expect(
      client({
        Main,
        Loading,
        Error: ErrorComponent,
        routesData,
      }),
    ).rejects.toThrow('Can not find main HTMLElement');
  });
});
