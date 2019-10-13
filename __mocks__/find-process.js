// @flow

/** mock find-process */
class FindProcess {
  +result = null;

  /**
   * @example
   * findProcess.main('name', 'cmd')
   *
   * @param {Array} argu - the arguments of find-process
   *
   * @return {Array} - the result of the mock find-process
   */
  +main = async (...argu: $ReadOnlyArray<mixed>) =>
    this.result || (await jest.requireActual('find-process')(...argu));
}

export const findProcess = new FindProcess();
export default findProcess.main;
