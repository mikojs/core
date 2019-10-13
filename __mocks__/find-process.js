// @flow

/** mock find-process */
class FindProcess {
  +result = [
    {
      pid: process.pid,
      cmd: '',
    },
  ];

  /**
   * @example
   * findProcess.main()
   *
   * @return {Array} - the result of the find-process
   */
  +main = () => this.result;
}

export const findProcess = new FindProcess();
export default findProcess.main;
