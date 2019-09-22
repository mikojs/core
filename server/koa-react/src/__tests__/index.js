// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';

import React from '../index';

import updateTestings from './__ignore__/updateTestings';

jest.mock('node-fetch', () =>
  jest.fn(async (url: string) => ({
    text: () => url,
  })),
);

const react = new React(path.resolve(__dirname, './__ignore__/page'), {
  dev: false,
  exclude: /exclude/,
});

describe('react', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('can not found folder', () => {
    expect(() => new React('/test')).toThrow('folder can not be found.');
  });

  test('not find urls file path', async () => {
    const mockLog = jest.fn();

    react.store.urlsFilePath = null;
    global.console.warn = mockLog;

    expect(await react.buildStatic()).toBeUndefined();
    expect(mockLog).toHaveBeenCalledTimes(8);
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

  test.each(updateTestings)(
    'udpate cache with %s',
    async (
      filePath: string,
      destPaths: $ReadOnlyArray<string>,
      contents: $ReadOnlyArray<string>,
    ) => {
      outputFileSync.destPaths = [];
      outputFileSync.contents = [];
      react.update(filePath);

      expect(outputFileSync.destPaths).toEqual(destPaths);
      expect(outputFileSync.contents).toEqual(contents);
    },
  );
});
