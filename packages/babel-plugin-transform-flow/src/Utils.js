// @flow

import path from 'path';

type optionsType = {|
  src?: Array<string>,
  outDir?: string,
  cli: boolean,
  verbose: boolean,
  watch: boolean,
  extension: RegExp,
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
    cli: true,
    verbose: false,
    watch: false,
    extension: /\.js\.flow$/,
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
    const {
      src,
      outDir,
      verbose,
      watch,
      ...initialOptions
    } = this.initialOptions;

    this.options = {
      ...initialOptions,
      ...options,
      src,
      outDir,
      verbose,
      watch,
    };

    this.validateOptions();
  };

  initializeOptions = options => {
    if (this.initialized) return;

    Object.keys(options).forEach((key: string) => {
      this.initialOptions[key] = options[key];
    });

    if (this.initialOptions.cli) {
      const { default: parseArgv } = require('@babel/cli/lib/babel/options');
      const {
        cliOptions: { verbose, filename, filenames, outFile, outDir, watch },
      } = parseArgv(process.argv);

      this.initialOptions.src = filename ? [path.dirname(filename)] : filenames;
      this.initialOptions.outDir = outFile ? path.dirname(outFile) : outDir;
      this.initialOptions.verbose = verbose;
      this.initialOptions.watch = watch;
    } else {
      this.initializeOptions.src =
        this.initializeOptions.src instanceof Array
          ? this.initializeOptions.src
          : [this.initializeOptions.src];
    }

    this.initialized = true;
  };

  validateOptions = () => {
    [
      {
        name: 'src',
        validate: values =>
          values.length !== 0 && !values.some(value => !Boolean(value)),
      },
      {
        name: 'outDir',
        validate: value => Boolean(value),
      },
    ].forEach(({ name, validate }) => {
      if (!validate(this.options[name]))
        throw new Error(
          `@cat-org/babel-plugin-transform-flow validate: \`${name}\` is invalid.`,
        );
    });
  };

  getFilePaths = (filePath, cwd) => {
    const { src, outDir } = this.options;
    const srcPath = filePath.replace(`${cwd}/`, '');
    const relativePath = src.reduce(
      (result: string, srcDir: string) => result.replace(`${srcDir}/`, ''),
      srcPath,
    );
    const destPath = path.join(outDir, relativePath);

    return {
      srcPath,
      destPath,
    };
  };

  get options() {
    return this.options;
  }
}

export default new Utils();
