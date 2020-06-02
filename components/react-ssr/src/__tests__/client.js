// @flow

import client from '../client';

import testings, {
  Main,
  Loading,
  ErrorComponent,
  errorTestings,
  chunkName,
  routes,
} from './__ignore__/testings';

const mockLog = jest.fn();
const mikojsData = {
  mainInitialProps: {},
  pageInitialProps: {},
  chunkName,
};

/**
 * @param {string} innerHTML - inner html
 * @param {object} data - mikojs data
 */
const renderClient = async (innerHTML: string, data: {}) => {
  global.document.getElementById('__MIKOJS__').innerHTML = innerHTML;
  global.window.__MIKOJS_DATA__ = data;

  await client({
    Main,
    Loading,
    Error: ErrorComponent,
    routes,
  });
};

describe('client', () => {
  beforeAll(() => {
    global.console.error = mockLog;
  });

  beforeEach(() => {
    const prevMain = global.document.querySelector('main');
    const main = global.document.createElement('main');

    mockLog.mockClear();
    main.setAttribute('id', '__MIKOJS__');

    if (prevMain)
      global.document.querySelector('body').replaceChild(main, prevMain);
    else global.document.querySelector('body').appendChild(main);
  });

  test('work', async () => {
    await renderClient(testings, mikojsData);

    expect(mockLog).not.toHaveBeenCalled();
  });

  test('error', async () => {
    await renderClient(errorTestings, {
      ...mikojsData,
      errorProps: {
        error: new Error('error'),
        errorInfo: {
          componentStack: '',
        },
      },
    });

    expect(mockLog).not.toHaveBeenCalled();
  });

  test('not find page component', async () => {
    await expect(
      client({
        Main,
        Loading,
        Error: ErrorComponent,
        routes: [],
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
        routes,
      }),
    ).rejects.toThrow('Can not find main HTMLElement');
  });
});
