import spliceEnv from '../spliceEnv';

describe('splice env', () => {
  test.each`
    argv                                  | expected
    ${['NODE_ENV=production', 'command']} | ${{ env: ['NODE_ENV=production'], argv: ['command'] }}
    ${['command']}                        | ${{ env: [], argv: ['command'] }}
  `('splice $argv', ({ argv, expected }) => {
    expect(spliceEnv(argv)).toEqual(expected);
  });
});
