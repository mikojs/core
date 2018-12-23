// @flow

import { execa } from 'execa';

import base from '../base';

import ctx from './__ignore__/ctx';

base.ctx = ctx;

test.each`
  pkg                                                      | expected
  ${undefined}                                             | ${3}
  ${{ repository: 'https://github.com/cat-org/core.git' }} | ${4}
`(
  'base with pkg = $pkg',
  async ({ pkg, expected }: { pkg?: {}, expected: number }): Promise<void> => {
    execa.cmds = [];

    expect(
      await base.end({
        ...ctx,
        pkg,
      }),
    ).toBeUndefined();
    expect(execa.cmds.length).toEqual(expected);
  },
);
