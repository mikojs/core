// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';

import utils from './utils';
import flowFiles from './flowFiles';
import writeFiles from './writeFiles';

import type { optionsType, manipulateOptionsPluginsType } from './utils';
import type { flowFileType } from './flowFiles';

export default declare(
  (
    api: { assertVersion: (version: number) => void },
    options: optionsType,
  ): {} => {
    api.assertVersion(7);
    utils.initializeOptions(options);

    return {
      manipulateOptions: utils.manipulateOptions,
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
          if (!utils.options.extension.test(value)) return;

          const filePath = path.resolve(filename, '..', value);

          if (
            flowFiles.store.some(
              (flowFile: flowFileType): boolean => flowFile.srcPath === srcPath,
            )
          )
            return;

          const { srcPath, destPath } = utils.getFilePaths(filePath, cwd);

          flowFiles.add({
            srcPath,
            destPath,
            filePath,
            babelConfigs: { parserOpts: {} },
          });
        },
      },
      post: ({
        opts: {
          cwd,
          filename,
          parserOpts: { plugins },
        },
      }: {
        opts: {
          cwd: string,
          filename: string,
          parserOpts: {
            plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
          },
        },
      }) => {
        const { configs } = utils.options;
        const { srcPath, destPath } = utils.getFilePaths(filename, cwd);
        const babelConfigs = {
          ...configs,
          parserOpts: {
            plugins,
            ...configs?.parserOpts,
          },
        };

        flowFiles.store.forEach((flowFile: flowFileType) => {
          if (Object.keys(flowFile.babelConfigs.parserOpts).length === 0) {
            flowFile.babelConfigs = babelConfigs;
            writeFiles.add(flowFile);
          }
        });

        const flowFilePath = srcPath.replace(/\.js$/, '.js.flow');

        writeFiles.add({
          srcPath: fs.existsSync(path.resolve(cwd, flowFilePath))
            ? flowFilePath
            : srcPath,
          destPath,
          babelConfigs,
        });
      },
    };
  },
);
