// @flow

import fs from 'fs';
import path from 'path';

import { transformFile } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import outputFileSync from 'output-file-sync';

import Utils from './Utils';

const flowFiles = [];
const writeFilesStore = [];

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
          if (!Utils.options.extension.test(value)) return;

          const filePath = path.resolve(filename, '..', value);
          const { ctimeMs } = fs.statSync(filePath);

          if (
            flowFiles.some(
              (flowFile: flowFileType): boolean =>
                flowFile.srcPath === srcPath && flowFile.ctimeMs === ctimeMs,
            )
          )
            return;

          const { srcPath, destPath } = Utils.getFilePaths(filePath, cwd);
          const flowFileIndex = flowFiles.findIndex(
            (flowFile: flowFileType): boolean => flowFile.srcPath === srcPath,
          );

          if (flowFileIndex !== -1) {
            flowFiles[flowFileIndex].ctimeMs = ctimeMs;
            writeFilesStore.push(flowFileIndex);
            return;
          }

          flowFiles.push({
            srcPath,
            destPath,
            ctimeMs,
          });
          writeFilesStore.push(flowFiles.length - 1);
        },
      },
      post: ({ opts: { cwd, filename } }) => {
        const { verbose, watch } = Utils.options;
        const { srcPath, destPath } = Utils.getFilePaths(filename, cwd);

        outputFileSync(`${destPath}.flow`, fs.readFileSync(srcPath, 'utf-8'));

        if (verbose) console.log(`${srcPath} -> ${destPath}.flow`);

        /*
        while (writeFilesStore.length !== 0) {
          const flowFileIndex = writeFilesStore.pop();
          const { srcPath, destPath } = flowFiles[flowFileIndex];

          transformFile(srcPath, opts, (err, result) => {
            if (err) {
              if (watch) return console.log(err);
              else throw new Error(err);
            }

            console.log(result);
            // TODO compile with babel
            outputFileSync(destPath, fs.readFileSync(srcPath, 'utf-8'));

            if (verbose) console.log(srcPath, ' -> ', destPath);
          });
        }
        */
      },
    };
  },
);
