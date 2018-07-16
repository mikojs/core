// @flow

import path from 'path';

import { declare } from '@babel/helper-plugin-utils';
import findup from 'findup';

import writeFile from './writeFile';

import type { flowFileType } from './definitions/index.js.flow';

type pluginOptionsType = {|
  dir: string,
  relativeRoot: string,
  source: string,
  target: string,
  extension: RegExp,
|};

const pluginOptions: pluginOptionsType = {
  dir: './lib',
  relativeRoot: './src',
  source: 'definitions',
  target: 'flow-typed',
  extension: /\.js\.flow$/,
};

const flowFiles: Array<flowFileType> = [];

export default declare(
  (
    api: { assertVersion: (version: number) => void },
    options: pluginOptionsType,
  ): {} => {
    api.assertVersion(7);

    Object.keys(options).forEach((key: string) => {
      pluginOptions[key] = options[key];
    });

    return {
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
            .replace(/\/index/, '')
            .replace(/^\./, '');
          const moduleName = `${pkgName}${
            modulePath === '' ? '' : pluginOptions.dir.replace(/\./, '')
          }${modulePath}`;

          flowFiles.push({ sourcePath, targetPath, moduleName });
        },
      },
      post: () => {
        flowFiles.forEach(writeFile);
      },
    };
  },
);
