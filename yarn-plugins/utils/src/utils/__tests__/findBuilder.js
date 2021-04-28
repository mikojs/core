import path from 'path';

import findBuilder from '../findBuilder';

describe('find builder', () => {
  test.each`
    cwd                   | expeced
    ${undefined}          | ${path.resolve('./node_modules/.bin/builder')}
    ${path.resolve('..')} | ${null}
  `('$cwd', ({ cwd, expeced }) => {
    expect(findBuilder(cwd)).toBe(expeced);
  });
});
