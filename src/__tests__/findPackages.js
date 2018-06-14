// @flow

import findPackages from '../findPackages';

describe('find packages', () => {
  it('equal', () => {
    expect(findPackages.sort())
      .toEqual([
        'utils',
        'eslint-config-cat',
      ].sort());
  });
});
