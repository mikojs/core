// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';
import { transformSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

export type optionsType = {|
  dir: string,
  relativeRoot: string,
  presets: $ReadOnlyArray<string>,
  plugins: $ReadOnlyArray<string>,
  verbose: boolean,
  ignore?: RegExp,
|};

export default declare(
  (
    { assertVersion }: {| assertVersion: (version: number) => void |},
    {
      dir = './lib',
      relativeRoot = './src',
      presets = [],
      plugins = [],
      verbose = true,
      ignore,
    }: optionsType,
  ): {} => {
    assertVersion(7);

    return {
      /**
       * @param {object} options - babel options
       * @param {object} options.opts - babel opts options
       * @param {string} options.opts.cwd - babel cwd option
       * @param {string} options.opts.filename - babel filename option
       * @param {object} options.opts.parserOpts - babel parserOpts options
       * @param {string} options.code - compiled code
       */
      post: ({
        opts: { cwd, filename, parserOpts },
        code: content,
      }: {|
        opts: {|
          cwd: string,
          filename: string,
          parserOpts: {},
        |},
        code: string,
      |}) => {
        if (ignore?.test(filename)) return;

        const { log } = console;
        const filePath = `${path.resolve(
          cwd,
          dir,
          path.relative(path.resolve(cwd, relativeRoot), filename),
        )}.flow`;
        const output = fs.existsSync(`${filename}.flow`)
          ? fs.readFileSync(`${filename}.flow`, 'utf-8')
          : transformSync(content, {
              filename,
              parserOpts,
              presets,
              plugins,
              babelrc: false,
              configFile: false,
            }).code;

        outputFileSync(
          filePath,
          output.replace(/fixme-flow-file-annotation/, '@flow'),
        );

        if (verbose)
          log(
            `${path.relative(cwd, filename)} -> ${path.relative(
              cwd,
              filePath,
            )}`,
          );
      },
    };
  },
);
