// @flow

// import buildStatic from '../buildStatic';

jest.mock('node-fetch', () =>
  jest.fn(async (url: string) => ({
    text: () => url,
  })),
);

test('build static', async () => {
  /* TODO
  expect(
    await buildStatic(
      {
        templates: {
          document: 'document',
          main: 'main',
          loading: 'loading',
          error: 'error',
        },
        routesData: [],
      },
      '/commons.js',
    ),
  ).toBeUndefined();
  */
});
