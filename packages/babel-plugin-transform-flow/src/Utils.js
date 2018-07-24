// @flow

import path from 'path';

type optionsType = {|
  src?: string,
  outDir?: string,
  extension: RegExp,
  generateFlowTest: false | string,
|};

type manipulateOptionsPluginsType = {
  options: optionsType,
  manipulateOptions: ({
    plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
  }) => void,
};

class Utils {
  initialized: boolean = false;

  initialOptions: optionsType = {
    extension: /\.js\.flow$/,
    generateFlowTest: './src/__tests__/flowCheck.js.flow',
  };

  options: optionsType = {};

  /**
   * @example
   * manipulateOptions({});
   *
   * @param {Object} opts - opts of manipulateOptions
   */
  manipulateOptions = ({
    plugins,
  }: $PropertyType<manipulateOptionsPluginsType, 'manipulateOptions'>) => {
    const [{ options }] = plugins.filter(
      ({ manipulateOptions }: manipulateOptionsPluginsType): boolean =>
        manipulateOptions === this.manipulateOptions,
    );

    this.options = {
      ...this.initialOptions,
      ...options,
    };

    /*
    if (flowTestPath === '' && options.generateFlowTest) {
      flowTestPath = path.resolve(cwd, options.generateFlowTest);
    }
    */
  };

  initializeOptions = options => {
    if (this.initialized) return;

    options.forEach((key: string) => {
      this.initialOptions[key] = options[key];
    });

    this.initialized = true;
  };

  get options() {
    return this.options;
  }
}

export default new Utils();
