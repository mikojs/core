// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';

import Utils from './Utils';

export default declare(
  (
    api: { assertVersion: (version: number) => void },
    options: pluginOptionsType,
  ): {} => {
    api.assertVersion(7);
    Utils.initializeOptions(options);

    return {
      manipulateOptions: Utils.manipulateOptions,
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
          console.log(Utils.options);
          /*
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
            path.resolve(cwd, pluginOptions.relativeRoot),
            '.',
          );
          const targetPath = path.resolve(
            cwd,
            pluginOptions.dir,
            relativePath,
          );

          flowFiles.push({
            sourcePath,
            targetPath,
          });
          */
        },
      },
      post: () => {
        // console.log(flowFiles);
        // flowFiles.forEach(writeFile);
        // if (!pluginOptions.generateFlowTest) return;
        // writeTest(flowFiles, flowTestPath);
      },
    };
  },
);
