// @flow

import path from 'path';

import React from '../index';

jest.mock('node-fetch', () =>
  jest.fn(async (url: string) => ({
    text: () => url,
  })),
);

const react = new React(path.resolve(__dirname, './__ignore__/page'), {
  dev: false,
});

describe('react', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('can not found folder', () => {
    expect(() => new React('/test')).toThrow('folder can not be found.');
  });

  test('not find module in buildStatic', async () => {
    react.store.urlsFilePath = path.resolve(
      __dirname,
      './__ignore__/notFound.js',
    );

    expect(await react.buildStatic()).toBeUndefined();
  });

  test('throw error in buildStatic', async () => {
    react.store.urlsFilePath = path.resolve(
      __dirname,
      './__ignore__/throwError.js',
    );

    await expect(react.buildStatic()).rejects.toThrow('error');
  });

  test('throw error in middleware', async () => {
    react.store.urlsFilePath = path.resolve(
      __dirname,
      './__ignore__/throwError.js',
    );

    await expect(react.middleware()).rejects.toThrow('error');
  });
});
