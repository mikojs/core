// @flow

import { execa } from 'execa';

import configs from '../configs';

import ctx from './__ignore__/ctx';

configs.ctx = ctx;

test.each`
  cmd       | expected
  ${'npm'}  | ${'npm install -D'}
  ${'yarn'} | ${'yarn add --dev'}
`(
  'configs with cmd = $cmd',
  async ({
    cmd,
    expected,
  }: {
    cmd: string,
    expected: string,
  }): Promise<void> => {
    execa.cmds = [];

    expect(
      await configs.end({
        ...ctx,
        cmd,
      }),
    ).toBeUndefined();
    expect(execa.cmds[1]).toBe(`${expected} @cat-org/configs@beta`);
  },
);
