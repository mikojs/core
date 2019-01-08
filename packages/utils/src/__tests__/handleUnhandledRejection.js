// @flow

import { ExecutionEnvironment } from 'fbjs';

import handleUnhandledRejection, {
  defaultErrorCallback,
} from '../handleUnhandledRejection';

test('default error callback', () => {
  expect(() => {
    defaultErrorCallback('test default error');
  }).toThrow('test default error');
});

describe('handle unhandleRejection', () => {
  test('node', () => {
    ExecutionEnvironment.canUseEventListeners = false;
    expect(handleUnhandledRejection).not.toThrow();
  });

  test('brwoser', () => {
    ExecutionEnvironment.canUseEventListeners = true;
    expect(handleUnhandledRejection).not.toThrow();
  });

  afterEach(() => {
    ExecutionEnvironment.canUseEventListeners = false;
  });
});
