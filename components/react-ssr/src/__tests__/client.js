// @flow

import client from '../client';

import testings, {
  Main,
  Loading,
  Error,
  chunkName,
  routesData,
} from './__ignore__/testings';

test('client', async () => {
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
    Error,
    routesData,
  });

  expect(mockLog).not.toHaveBeenCalled();
});
