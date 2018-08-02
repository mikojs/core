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
            filename?: string,
          },
        ) => {
          if (!utils.options.extension.test(value) || !filename) return;

          const filePath = path.resolve(filename, '..', value);
          const { srcPath, destPath } = utils.getFilePaths(filePath, cwd);

          if (flowFiles.fileExist(srcPath)) return;

          flowFiles.add({
            srcPath,
            destPath,
            filePath,
            babelConfigs: { parserOpts: {}, notInitialized: true },
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
          filename?: string,
          parserOpts: {
            plugins: $ReadOnlyArray<manipulateOptionsPluginsType>,
          },
        },
      }) => {
        if (!filename) return;

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
          if (flowFile.babelConfigs.notInitialized) {
            delete flowFile.babelConfigs.notInitialized;

            flowFile.babelConfigs = babelConfigs;
            writeFiles.add(flowFile);
          }
        });

        const flowFilePath = filename.replace(/\.js$/, '.js.flow');
        const flowSrcPath = srcPath.replace(/\.js$/, '.js.flow');

        if (fs.existsSync(flowFilePath)) {
          if (!flowFiles.fileExist(flowSrcPath)) {
            const flowFile = {
              srcPath: flowSrcPath,
              destPath,
              filePath: flowFilePath,
              babelConfigs,
            };

            flowFiles.add(flowFile);
            writeFiles.add(flowFile);
          }

          return;
        }

        writeFiles.add({
          srcPath,
          destPath,
          babelConfigs,
        });
      },
    };
  },
);
