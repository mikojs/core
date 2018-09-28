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
          if (!/\.js\.flow$/.test(value)) return;

          const filePath = path.resolve(filename, '..', value);
          const { srcPath, destPath } = utils.getFilePaths(filePath, cwd);

          if (flowFiles.fileExist(srcPath)) return;

          flowFiles.add({
            srcPath,
            destPath,
            filePath,
            babelConfig: { parserOpts: {}, notInitialized: true },
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
        const { config } = utils.options;
        const { srcPath, destPath } = utils.getFilePaths(filename, cwd);
        const babelConfig = {
          ...config,
          parserOpts: {
            plugins,
            ...config?.parserOpts,
          },
        };

        flowFiles.store.forEach((flowFile: flowFileType) => {
          if (flowFile.babelConfig.notInitialized) {
            delete flowFile.babelConfig.notInitialized;

            flowFile.babelConfig = babelConfig;
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
              babelConfig,
            };

            flowFiles.add(flowFile);
            writeFiles.add(flowFile);
          }

          return;
        }

        writeFiles.add({
          srcPath,
          destPath,
          babelConfig,
        });
      },
    };
  },
);
