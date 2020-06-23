// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { mergeDir } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType as serverOptionsType } from '@mikojs/server';

import { type routesType } from '../index';

import addRoute from './addRoute';

import templates from 'templates';

export type optionsType = serverOptionsType;

const debugLog = debug('pages:buildRoutes');
const defaultNotFountMergeData = {
  filePath: path.resolve(__dirname, '../templates/NotFound.js'),
  name: 'NotFound.js',
  extension: '.js',
};

/**
 * @param {routesType} routes - routes
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 */
export default (
  routes: routesType,
  folderPath: string,
  options: optionsType,
) => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    basename,
    ...mergeDirOptions
  } = options;

  addRoute(routes, folderPath, basename, 'add', defaultNotFountMergeData, true);
  mergeDir(
    folderPath,
    {
      ...mergeDirOptions,
      watch: dev,
      extensions: /\.js$/,
    },
    (event: mergeDirEventType, data: mergeDirDataType) => {
      const { filePath, name, extension } = data;

      logger('start', event, filePath);

      if (['init', 'add', 'change', 'unlink'].includes(event)) {
        if (/^\.templates/.test(path.relative(folderPath, filePath))) {
          const filename = name.replace(extension, '').toLowerCase();

          switch (filename) {
            case 'document':
            case 'main':
            case 'loading':
            case 'error':
              routes.templates[filename] =
                event !== 'unlink' ? filePath : templates[filename];
              break;

            case 'notfound':
              addRoute(
                routes,
                folderPath,
                basename,
                event,
                event === 'unlink' ? defaultNotFountMergeData : data,
                true,
              );
              break;

            default:
              break;
          }
        } else addRoute(routes, folderPath, basename, event, data, false);

        if (event !== 'init') routes.events.emit('build');
      }

      debugLog(routes.templates);
      debugLog(routes.cache);
      logger('end', event, filePath);
    },
  );
  routes.events.emit('build');
};
