// @flow

import findPackages from '../bin/findPackages';

describe('find packages', () => {
  it('equal', () => {
    expect(findPackages.sort()).toEqual(
      ['utils', 'eslint-config-cat', 'configs'].sort(),
    );
  });
});
