// @flow

class Options {
  cliOptions = null;

  setCliOptions = (cliOptions: {} | null) => {
    this.cliOptions = cliOptions;
  };

  main = () => ({
    cliOptions: this.cliOptions,
  });
}

const options = new Options();

export const setCliOptions = options.setCliOptions;
export default options.main;
