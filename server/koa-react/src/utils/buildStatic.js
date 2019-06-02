// @flow

import path from 'path';

import fetch from 'node-fetch';
import outputFileSync from 'output-file-sync';

import { type dataType } from './getData';

export type optionsType = {|
  baseUrl?: string,
  folderPath?: string,
|};

export default async (
  { routesData }: dataType,
  commonsUrl: string,
  {
    baseUrl = 'http://localhost:8000',
    folderPath = path.resolve('./docs'),
  }: optionsType = {},
) => {
  const routePaths = routesData.reduce(
    (
      result: $ReadOnlyArray<string>,
      {
        routePath,
      }: $ElementType<$PropertyType<dataType, 'routesData'>, number>,
    ) => [...result, ...routePath],
    [commonsUrl],
  );

  if (routePaths.length !== 0)
    await Promise.all(
      routePaths.map(async (routePath: string) => {
        outputFileSync(
          path.resolve(
            folderPath,
            `.${routePath.replace(/\*$/, 'notFound')}`,
            /\.js$/.test(routePath) ? '' : './index.html',
          ),
          await fetch(`${baseUrl}${routePath}`).then(
            (res: {| text: () => string |}) => res.text(),
          ),
        );
      }),
    );
};
