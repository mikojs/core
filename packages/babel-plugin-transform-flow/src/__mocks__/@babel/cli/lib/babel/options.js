// @flow

/**
 * @example
 * new Options()
 */
class Options {
  cliOptions = null;

  /**
   * @example
   * options.setCliOptions();
   */
  setCliOptions = (cliOptions: {} | null) => {
    this.cliOptions = cliOptions;
  };

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

const options = new Options();

export const setCliOptions = options.setCliOptions;
export default options.main;
