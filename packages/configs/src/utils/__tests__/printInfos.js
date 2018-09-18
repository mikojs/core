// @flow

import printInfos from '../printInfos';

describe('print infos', () => {
  it('not error', () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;
    printInfos(['success'], false);

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('  {green configs-scripts} success');
  });

  it('error', () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;
    expect(() => {
      printInfos(['fail'], true);
    }).toThrow('process exit');

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith('  {red configs-scripts} fail');
  });
});
