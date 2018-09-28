// @flow

import path from 'path';

import parseArgv from '@babel/cli/lib/babel/options';

import { name as pkgName } from '../package.json';

export type initialOptionsType = {|
  src?: $ReadOnlyArray<string>,
  outDir?: string,
  verbose: boolean,
  watch: boolean,
|};

export type optionsType = {|
  src: $ReadOnlyArray<string>,
  outDir: string,
  config?: {
    parserOpts?: {},
  },
  verbose: boolean,
  watch: boolean,
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

  initialOptions: initialOptionsType = {
    verbose: false,
    watch: false,
  };

  options: optionsType = {
    ...this.initialOptions,
    src: ['src'],
    outDir: 'lib',
  };

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
        cliOptions: { verbose, filenames, outFile, outDir, watch },
      } = parseArgv(process.argv);

      // $FlowFixMe flow not yet support
      this.initialOptions.src = filenames?.map(
        (filename: string): string => {
          if (outFile) return path.dirname(filename).replace(/^\.\//, '');
          return filename.replace(/^\.\//, '');
        },
      );

      this.initialOptions.outDir = outFile ? path.dirname(outFile) : outDir;
      this.initialOptions.verbose = Boolean(verbose);
      this.initialOptions.watch = Boolean(watch);
      this.initialized = true;

      if (!this.initialOptions.src || !this.initialOptions.outDir)
        throw new Error('initialized error');
    } catch (e) {
      if (e.message !== 'initialized error') throw new Error(`${pkgName} ${e}`);

      throw new Error(
        `${pkgName} only can be used with @babel/cli: Can not find \`src\` or \`outDir\``,
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
    const { src, outDir } = this.options;
    const srcPath = filePath.replace(`${cwd}/`, '');
    const relativePath = src.reduce(
      (result: string, srcDir: string): string => result.replace(srcDir, ''),
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
