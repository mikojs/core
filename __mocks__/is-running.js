// @flow

/** mock is-running */
class IsRunning {
  +running = false;

  /**
   * @example
   * isRunning.main()
   *
   * @return {boolean} - if pid is running
   */
  +main = () => this.running;
}

export const isRunning = new IsRunning();
export default isRunning.main;
