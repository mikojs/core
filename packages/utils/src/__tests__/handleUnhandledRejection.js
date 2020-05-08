// @flow

import { ExecutionEnvironment } from 'fbjs';

import handleUnhandledRejection from '../handleUnhandledRejection';

describe('handle unhandleRejection', () => {
  test('default error callback', () => {
    const mockAddEventListener = jest.fn();

    window.addEventListener = mockAddEventListener;
    ExecutionEnvironment.canUseEventListeners = true;
    handleUnhandledRejection();

    expect(mockAddEventListener).toHaveBeenCalled();

    const [[, callback]] = mockAddEventListener.mock.calls;

    expect(callback).not.toBeUndefined();
    expect(() => callback(new Error('error'))).toThrow('error');
  });

  test.each`
    isBrowser
    ${false}
    ${true}
  `(
    'env with isBrowser = $isBrowser',
    ({ isBrowser }: {| isBrowser: boolean |}) => {
      ExecutionEnvironment.canUseEventListeners = isBrowser;
      expect(handleUnhandledRejection()).toBeUndefined();
    },
  );
});
