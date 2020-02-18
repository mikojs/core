// @flow

import printInfo from '../printInfo';

test('print info', () => {
  const mockLog = jest.fn();

  global.console.log = mockLog;
  printInfo({
    lerna: {
      babel: [],
      'babel:watch': [],
      lint: {
        watch: [],
      },
    },
  });

  expect(mockLog).toHaveBeenNthCalledWith(1, '  - lerna:babel');
  expect(mockLog).toHaveBeenNthCalledWith(2, '  - lerna:babel:watch');
  expect(mockLog).toHaveBeenNthCalledWith(3, '  - lerna:lint:watch');
});
