// @flow

import path from 'path';

import debug from 'debug';
import fetch from 'node-fetch';
import outputFileSync from 'output-file-sync';

import constants from './constants';

export type optionsType = {|
  baseUrl?: string,
  folderPath?: string,
|};

const debugLog = debug('react:buildStatic');
const { routesData } = constants;

/**
 * @example
 * buildStatic(data, '/commons-url', options)
 *
 * @param {string} commonsUrl - commons url
 * @param {optionsType} options - build static options
 */
export default async (
  commonsUrl: string,
  {
    baseUrl = 'http://localhost:8000',
    folderPath = path.resolve('./docs'),
  }: optionsType = {},
) => {
  await Promise.all(
    routesData
      .reduce(
        (
          result: $ReadOnlyArray<string>,
          { path: routePath }: $ElementType<typeof routesData, number>,
        ) => [...result, ...routePath],
        [commonsUrl],
      )
      .map(async (routePath: string) => {
        const filePath = path.resolve(
          folderPath,
          `.${routePath.replace(/\*$/, 'notFound')}`,
          /\.js$/.test(routePath) ? '' : './index.html',
        );

        debugLog({
          routePath,
          filePath,
        });

        outputFileSync(
          filePath,
          await fetch(`${baseUrl}${routePath}`).then(
            (res: {| text: () => string |}) => res.text(),
          ),
        );
      }),
  );
};
