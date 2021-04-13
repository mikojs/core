import spliceEnv from '../spliceEnv';

describe('splice env', () => {
  test.each`
    argv                                  | expected
    ${['NODE_ENV=production', 'command']} | ${[['NODE_ENV=production'], ['command']]}
    ${['command']}                        | ${[[], ['command']]}
  `('splice $argv', ({ argv, expected }) => {
    expect(spliceEnv(argv)).toEqual(expected);
  });
});
