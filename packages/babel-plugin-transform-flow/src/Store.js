// @flow

import path from 'path';

type optionsType = {|
  dir: string,
  relativeRoot: string,
  extension: RegExp,
  generateFlowTest: false | string,
|};

type manipulateOptionsPluginsType = {
  options: optionsType,
  manipulateOptions: ({
    cwd: string,
    plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
  }) => void,
};

class Store {
  options: optionsType = {
    dir: './lib',
    relativeRoot: './src',
    extension: /\.js\.flow$/,
    generateFlowTest: './src/__tests__/flowCheck.js.flow',
  };

  /**
   * @example
   * manipulateOptions({});
   *
   * @param {Object} opts - opts of manipulateOptions
   */
  manipulateOptions = ({
    cwd,
    plugins,
  }: $PropertyType<manipulateOptionsPluginsType, 'manipulateOptions'>) => {
    const [{ options }] = plugins.filter(
      ({ manipulateOptions }: manipulateOptionsPluginsType): boolean =>
        manipulateOptions === this.manipulateOptions,
    );

    this.addOptions(options);

    /*
    if (flowTestPath === '' && options.generateFlowTest) {
      flowTestPath = path.resolve(cwd, options.generateFlowTest);
    }
    */
  };

  addOptions = options => {
    Object.keys(options).forEach((key: string) => {
      this.options[key] = options[key];
    });
  };

  get getOptions() {
    return this.options;
  }
}

export default new Store();
