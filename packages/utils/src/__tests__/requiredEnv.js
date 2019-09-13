// @flow

import requiredEnv from '../requiredEnv';

describe('required env', () => {
  test('work', () => {
    expect(requiredEnv('NODE_ENV')).toBeUndefined();
  });

  test('not find env variables', () => {
    expect(() => {
      requiredEnv('not-found-env');
    }).toThrow('those env variables are required: not-found-env');
  });
});
