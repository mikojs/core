// @flow

import findPackages from './../findPackages';

describe('find packages', () => {
  it('equal', () => {
    expect(findPackages)
      .toEqual([
        'cat-utils',
        'eslint-config-cat',
      ]);
  });
});
