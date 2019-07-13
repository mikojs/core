// @flow

import path from 'path';

import debug from 'debug';
import fetch from 'node-fetch';
import outputFileSync from 'output-file-sync';

import type CacheType from './Cache';

export type optionsType = {|
  baseUrl?: string,
  folderPath?: string,
  urlParamsRedirect?: (route: string) => ?string,
|};

const debugLog = debug('react:buildStatic');

/**
 * @example
 * urlParamsWarning('/:id')
 *
 * @param {string} route - route string
 */
const urlParamsWarning = (route: string) => {
  const { warn } = console;

  warn(`You should not use the url parameters with building static: ${route}`);
  warn(`Use "urlParamsRedirect" in the options with building static.`);
};

/**
 * @example
 * buildStatic(data, '/commons-url', options)
 *
 * @param {CacheType} cache - cache data
 * @param {string} commonsUrl - commons url
 * @param {optionsType} options - build static options
 */
export default async (
  cache: CacheType,
  commonsUrl: string,
  {
    baseUrl = 'http://localhost:8000',
    folderPath = path.resolve('./docs'),
    urlParamsRedirect = urlParamsWarning,
  }: optionsType = {},
) => {
  await Promise.all(
    cache.routesData
      .reduce(
        (
          result: $ReadOnlyArray<string>,
          {
            path: routePath,
          }: $ElementType<$PropertyType<CacheType, 'routesData'>, number>,
        ) => [
          ...result,
          ...routePath
            .map((route: string) =>
              !/\/:/.test(route)
                ? route
                : // $FlowFixMe https://github.com/facebook/flow/issues/1414
                  urlParamsRedirect(route),
            )
            .filter((route: ?string) => route),
        ],
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
