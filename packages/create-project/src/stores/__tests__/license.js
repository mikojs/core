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
  }: {|
    pkg?: {| author: string |},
    expected: boolean,
  |}) => {
    outputFileSync.contents = [];

    expect(
      await license.end({
        ...ctx,
        pkg,
      }),
    ).toBeUndefined();
    (expected
      ? expect(outputFileSync.contents[0])
      : expect(outputFileSync.contents[0]).not
    ).toMatch(new RegExp(author));
  },
);
