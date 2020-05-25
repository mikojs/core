// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { mergeDir } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType } from '@mikojs/server';

import templates from 'templates';

type cacheType = {|
  document: string,
  main: string,
  loading: string,
  error: string,
|};

const debugLog = debug('pages:buildPages');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {cacheType} - routes cache
 */
export default (
  folderPath: string,
  options: optionsType,
) => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    basename,
    ...mergeDirOptions
  } = options;
  const cache: cacheType = {
    ...templates,
  };

  mergeDir(
    folderPath,
    {
      ...mergeDirOptions,
      watch: dev,
      extensions: /\.js$/,
    },
    (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      logger('start', event, filePath);

      if (['init', 'add', 'change', 'unlink'].includes(event)) {
        if (/^\.templates/.test(path.resolve(folderPath, filePath))) {
          const filename = name.replace(extension, '').toLowerCase();

          switch (filename) {
            case 'document':
            case 'main':
            case 'loading':
            case 'error':
              cache[filename] = event !== 'unlink' ? filePath : templates[filename];
              break;

            default:
              break;
          }
        }
      }

      debugLog(cache);
      logger('end', event, filePath);
    },
  );
};
