// @flow

import { ExecutionEnvironment } from 'fbjs';

import logger, { hideLoggerInProduction } from '../logger';

describe('hide logger in production', () => {
  it('production', () => {
    const mockLogger = jest.fn();

    hideLoggerInProduction(true, mockLogger)('production');

    expect(mockLogger).toHaveBeenCalledTimes(0);
    expect(mockLogger).not.toHaveBeenCalledWith('production');
  });

  it('not production', () => {
    const mockLogger = jest.fn();

    hideLoggerInProduction(false, mockLogger)('not production');

    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith('not production');
  });
});

describe('logger', () => {
  describe('node', () => {
    it('info', () => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      ExecutionEnvironment.canUseEventListeners = false;

      const log = logger('node');

      log.info('info message');

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith('{green node} info message');
    });

    it('error', () => {
      const mockError = jest.fn();

      global.console.error = mockError;
      ExecutionEnvironment.canUseEventListeners = false;

      const log = logger('node');

      log.error('error message');

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith('{red node} error message');
    });
  });

  describe('brwoser', () => {
    it('info', () => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      ExecutionEnvironment.canUseEventListeners = true;

      const log = logger('brwoser');

      log.info('info message');

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith(
        '%cbrwoser%c info message',
        'color: green',
        'color: black',
      );
    });

    it('error', () => {
      const mockError = jest.fn();

      global.console.error = mockError;
      ExecutionEnvironment.canUseEventListeners = true;

      const log = logger('brwoser');

      log.error('error message');

      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(
        '%cbrwoser%c error message',
        'color: red',
        'color: black',
      );
    });
  });
});
