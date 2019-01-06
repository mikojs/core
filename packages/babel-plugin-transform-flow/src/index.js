// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';

import handler from './utils/handler';
import flowFiles from './utils/flowFiles';
import writeFiles from './utils/writeFiles';

import type { optionsType } from './utils/handler';
import type { flowFileType } from './utils/flowFiles';

export default declare(
  (
    api: { assertVersion: (version: number) => void },
    options: optionsType,
  ): {} => {
    api.assertVersion(7);
    handler.initializeOptions(options);

    return {
      manipulateOptions: handler.manipulateOptions,
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
          const { srcPath, destPath } = handler.getFilePaths(filePath, cwd);

          if (flowFiles.fileExist(srcPath)) return;

          flowFiles.add({
            srcPath,
            destPath,
            filePath,
            babelConfig: { notInitialized: true },
          });
        },
      },
      post: ({
        opts: { cwd, filename, parserOpts },
      }: {
        opts: {
          cwd: string,
          filename: string,
          parserOpts: {},
        },
      }) => {
        const { plugins } = handler.options;
        const { srcPath, destPath } = handler.getFilePaths(filename, cwd);
        const babelConfig = {
          plugins,
          parserOpts,
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
