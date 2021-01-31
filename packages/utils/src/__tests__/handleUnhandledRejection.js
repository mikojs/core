// @flow

import { ExecutionEnvironment } from 'fbjs';

import handleUnhandledRejection from '../handleUnhandledRejection';

describe('handle unhandleRejection', () => {
  test('default error callback', () => {
    const mockAddEventListener = jest.fn();
    const errorMessage = 'Run command fail.';

    window.addEventListener = mockAddEventListener;
    ExecutionEnvironment.canUseEventListeners = true;
    handleUnhandledRejection();

    const [[, callback]] = mockAddEventListener.mock.calls;

    expect(mockAddEventListener).toHaveBeenCalled();
    expect(callback).not.toBeUndefined();
    expect(() => callback(new Error(errorMessage))).toThrow(errorMessage);
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
