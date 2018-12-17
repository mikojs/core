// @flow

import { outputFileSync } from 'output-file-sync';

import license from '../license';

import ctx from './__ignore__/ctx';

const author = 'cat <cat@gmail.com>';

license.ctx = ctx;

test.each`
  pkg           | expected
  ${undefined}  | ${false}
  ${{ author }} | ${true}
`(
  'license with pkg = $pkg',
  async ({
    pkg,
    expected,
  }: {
    pkg?: { author: string },
    expected: boolean,
  }): Promise<void> => {
    outputFileSync.contents = [];

    expect(
      await license.end({
        ...ctx,
        pkg,
      }),
    ).toBeUndefined();
    expect(new RegExp(author).test(outputFileSync.contents[0])).toBe(expected);
  },
);
