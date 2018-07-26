// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';

import utils from './utils';
import flowFiles from './flowFiles';
import writeFiles from './writeFiles';

export default declare(
  (
    api: { assertVersion: (version: number) => void },
    options: pluginOptionsType,
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
          const flowFile = flowFiles.store.find(
            (flowFile: flowFileType): boolean => flowFile.srcPath === srcPath,
          );

          flowFiles.add({ srcPath, destPath, filePath });
        },
      },
      post: ({
        opts: {
          cwd,
          filename,
          parserOpts: { plugins },
        },
      }) => {
        const { verbose, watch, configs } = utils.options;
        const { srcPath, destPath } = utils.getFilePaths(filename, cwd);
        const babelConfigs = {
          ...configs,
          parserOpts: {
            plugins,
            ...configs?.parserOpts,
          },
        };

        flowFiles.store.forEach(flowFile => {
          if (!flowFile.babelConfigs) {
            flowFile.babelConfigs = babelConfigs;
            writeFiles.add(flowFile);
          }
        });
        writeFiles.add({ srcPath, destPath, babelConfigs });
      },
    };
  },
);
