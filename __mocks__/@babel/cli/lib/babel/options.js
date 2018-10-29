// @flow

/**
 * @example
 * new Options()
 */
class Options {
  cliOptions = null;

  /**
   * @example
   * options.main();
   *
   * @return {Object} - object of cliOptions
   */
  main = (): {
    cliOptions: {} | null,
  } => ({
    cliOptions: this.cliOptions,
  });
}

export const options = new Options();
export default options.main;
