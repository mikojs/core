// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';
import findup from 'findup';

import writeFile from './writeFile';
import writeTest from './writeTest';

import type { flowFileType } from './definitions/index.js.flow';

type pluginOptionsType = {|
  dir: string,
  relativeRoot: string,
  source: string,
  target: string,
  extension: RegExp,
  generateFlowTest: false | string,
|};

const pluginOptions: pluginOptionsType = {
  dir: './lib',
  relativeRoot: './src',
  source: 'definitions',
  target: 'flow-typed',
  extension: /\.js\.flow$/,
  generateFlowTest: './src/__tests__/flowCheck.js.flow',
};

const flowFiles: Array<flowFileType> = [];

let flowTestPath: string = '';

export default declare(
  (
    api: { assertVersion: (version: number) => void },
    options: pluginOptionsType,
  ): {} => {
    api.assertVersion(7);

    type manipulateOptionsPluginsType = {
      cwd: string,
      options: pluginOptionsType,
      manipulateOptions: ({
        plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
      }) => void,
    };

    /**
     * @example
     * manipulateOptions({});
     *
     * @param {Object} opts - opts of manipulateOptions
     */
    const manipulateOptions = ({
      cwd,
      plugins,
    }: {
      cwd: string,
      plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
    }) => {
      const [{ options: newOptions }] = plugins.filter(
        (plugin: manipulateOptionsPluginsType): boolean =>
          plugin.manipulateOptions === manipulateOptions,
      );

      Object.keys({ ...options, ...newOptions }).forEach((key: string) => {
        pluginOptions[key] = options[key];
      });

      if (flowTestPath === '' && pluginOptions.generateFlowTest) {
        flowTestPath = path.resolve(cwd, pluginOptions.generateFlowTest);
      }
    };

    return {
      manipulateOptions,
      visitor: {
        ImportDeclaration: (
          {
            node: {
              source: { value },
            },
          }: {
            node: {
              source: { value: string },
            },
          },
          {
            cwd,
            filename,
          }: {
            cwd: string,
            filename: string,
          },
        ) => {
          if (!pluginOptions.extension.test(value)) return;

          const sourcePath = path.resolve(filename, '..', value);

          if (
            flowFiles.some(
              ({ sourcePath: flowFilesSource }: flowFileType): boolean =>
                flowFilesSource === sourcePath,
            )
          )
            return;

          // path setting
          const relativePath = sourcePath.replace(
            path.resolve(cwd, pluginOptions.relativeRoot, pluginOptions.source),
            '.',
          );
          const targetPath = path.resolve(
            cwd,
            pluginOptions.dir,
            pluginOptions.target,
            relativePath,
          );

          // module name
          const { name: pkgName } = require(path.resolve(
            findup.sync(sourcePath, 'package.json'),
            './package.json',
          ));
          const modulePath = relativePath
            .replace(pluginOptions.extension, '')
            .replace(/\/index$/, '')
            .replace(/^\./, '');
          const moduleName = `${pkgName}${
            modulePath === '' ? '' : pluginOptions.dir.replace(/\./, '')
          }${modulePath}`;

          const exportType = `${moduleName.split(/\//).slice(-1)[0]}Type`;
          const source = fs.readFileSync(sourcePath, 'utf-8');

          flowFiles.push({
            source,
            sourcePath,
            targetPath,
            filename,
            moduleName,
            exportType,
          });
        },
      },
      post: () => {
        flowFiles.forEach(writeFile);

        if (!pluginOptions.generateFlowTest) return;

        writeTest(flowFiles, flowTestPath);
      },
    };
  },
);
