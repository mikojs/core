// @flow

import path from 'path';

import requireModule from '../requireModule';

describe('require module', () => {
  test.each`
    moduleName
    ${'jsonFile.json'}
    ${'defaultModule.js'}
    ${'module.js'}
  `('require $moduleName', ({ moduleName }: {| moduleName: string |}) => {
    expect(
      requireModule<*>(path.resolve(__dirname, './__ignore__', moduleName)),
    ).toEqual({ key: 'value' });
  });
});
