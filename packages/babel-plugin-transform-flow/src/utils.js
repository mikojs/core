// @flow

import path from 'path';

import parseArgv from '@babel/cli/lib/babel/options';

export type optionsType = {|
  src?: $ReadOnlyArray<string>,
  outDir?: string,
  configs?: {
    parserOpts?: {},
  },
  verbose: boolean,
  watch: boolean,
  extension: RegExp,
|};

export type manipulateOptionsPluginsType = {
  options: optionsType,
  manipulateOptions: ({
    plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
  }) => void,
};

/**
 * @example
 * new Utils()
 */
class Utils {
  initialized: boolean = false;

  initialOptions: optionsType = {
    verbose: false,
    watch: false,
    extension: /\.js\.flow$/,
  };

  options: optionsType = this.initialOptions;

  /**
   * @example
   * utils.initializeOptions()
   *
   * @param {Object} options - options of babel-plugin-transform-flow
   */
  initializeOptions = (options: {}) => {
    if (this.initialized) return;

    Object.keys(options).forEach((key: string) => {
      this.initialOptions[key] = options[key];
    });

    try {
      const {
        cliOptions: { verbose, filename, filenames, outFile, outDir, watch },
      } = parseArgv(process.argv);

      this.initialOptions.src = filename ? [path.dirname(filename)] : filenames;
      this.initialOptions.outDir = outFile ? path.dirname(outFile) : outDir;
      this.initialOptions.verbose = Boolean(verbose);
      this.initialOptions.watch = Boolean(watch);
      this.initialized = true;

      if (!this.initialOptions.src || !this.initialOptions.outDir)
        throw new Error('initialized error');
    } catch (e) {
      if (e.message !== 'initialized error')
        throw new Error(`@cat-org/babel-plugin-transform-flow error: ${e}`);

      throw new Error(
        '@cat-org/babel-plugin-transform-flow only can be used with @babel/cli: Can not find `src` or `outDir`',
      );
    }
  };

  /**
   * @example
   * utils.manipulateOptions({});
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

  validateOptions = () => {
    [
      {
        name: 'src',
        validate: (values: $ReadOnlyArray<string>): boolean =>
          values.length !== 0 &&
          !values.some((value: string): boolean => !value),
      },
      {
        name: 'outDir',
        validate: (value?: string): boolean => !!value,
      },
    ].forEach(
      ({
        name,
        validate,
      }: {
        name: string,
        validate:
          | ((value: $ReadOnlyArray<string>) => boolean)
          | ((value?: string) => boolean),
      }) => {
        if (!validate(this.options[name]))
          throw new Error(
            `@cat-org/babel-plugin-transform-flow validate: \`${name}\` is invalid.`,
          );
      },
    );
  };

  /**
   * @example
   * utils.getFilePaths('src', '/path');
   *
   * @param {string} filePath - the path of the file
   * @param {string} cwd - the path of cwd
   * @return {Object} - an object of { srcPath, destPath }
   */
  getFilePaths = (
    filePath: string,
    cwd: string,
  ): {
    srcPath: string,
    destPath: string,
  } => {
    const { src = [], outDir = '' } = this.options;
    const srcPath = filePath.replace(`${cwd}/`, '');
    const relativePath = src.reduce(
      (result: string, srcDir: string): string =>
        result.replace(`${srcDir}/`, ''),
      srcPath,
    );
    const destPath = path
      .join(outDir, relativePath)
      .replace(/\.js$/, '.js.flow');

    return {
      srcPath,
      destPath,
    };
  };
}

export default new Utils();
