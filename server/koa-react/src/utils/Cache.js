// @flow

import path from 'path';

import debug from 'debug';

import { d3DirTree, requireModule } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import { type propsType } from './Root';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

const debugLog = debug('react:getData');

type dataType = {|
  templates: {|
    document: string,
    main: string,
    loading: string,
    error: string,
  |},
  routesData: $ReadOnlyArray<{|
    routePath: $ReadOnlyArray<string>,
    chunkName: string,
    filePath: string,
  |}>,
|};

export default class Cache {
  store: dataType;

  options: {|
    folderPath: string,
    redirect: redirectType,
    basename?: string,
  |};

  notFound: $ElementType<$PropertyType<dataType, 'routesData'>, number>;

  /**
   * @example
   * getData('/folder-path', () => {})
   *
   * @param {string} folderPath - folder path
   * @param {Function} redirect - redirect url path
   * @param {string} basename - basename to join url
   * @param {RegExp} exclude - exclude file path
   *
   * @return {dataType} - routes data
   */
  constructor(
    folderPath: string,
    redirect: redirectType,
    basename?: string,
    exclude?: RegExp,
  ) {
    this.notFound = {
      routePath: [`${basename || ''}/*`],
      chunkName: `pages${basename || ''}/notFound`,
      filePath: path.resolve(__dirname, '../templates/NotFound.js'),
    };
    this.store = {
      templates: {
        document: path.resolve(__dirname, '../templates/Document.js'),
        main: path.resolve(__dirname, '../templates/Main.js'),
        loading: path.resolve(__dirname, '../templates/Loading.js'),
        error: path.resolve(__dirname, '../templates/Error.js'),
      },
      routesData: [this.notFound],
    };
    this.options = {
      folderPath,
      redirect,
      basename,
    };

    this.handleData(
      d3DirTree(folderPath, {
        extensions: /.jsx?$/,
        exclude,
      }).leaves(),
    );
  }

  +handleData = (data: $ReadOnlyArray<d3DirTreeNodeType>) => {
    const { folderPath, redirect, basename } = this.options;

    this.store = data.reduce(
      (
        result: dataType,
        { data: { name, path: filePath } }: d3DirTreeNodeType,
      ): dataType => {
        const relativePath = path
          .relative(folderPath, filePath)
          .replace(/\.jsx?$/, '');

        debugLog(relativePath);

        if (/^\.templates/.test(relativePath))
          switch (relativePath.replace(/^\.templates\//, '')) {
            case 'Document':
            case 'Main':
            case 'Loading':
            case 'Error':
              result.templates[
                relativePath.replace(/^\.templates\//, '').toLowerCase()
              ] = filePath;
              return result;

            case 'NotFound':
              return {
                ...result,
                routesData: [
                  ...result.routesData.filter(
                    ({
                      chunkName,
                    }: $ElementType<
                      $PropertyType<dataType, 'routesData'>,
                      number,
                    >) => chunkName !== this.notFound.chunkName,
                  ),
                  {
                    ...this.notFound,
                    filePath,
                  },
                ],
              };

            default:
              return result;
          }

        const routePath = redirect([
          relativePath.replace(/(\/?index)?$/, '').replace(/^/, '/'),
        ]);

        debugLog(routePath);

        return {
          ...result,
          routesData: [
            {
              routePath: !basename
                ? routePath
                : routePath.map((prevPath: string) => `${basename}${prevPath}`),
              chunkName: `pages${basename || ''}/${relativePath}`,
              filePath,
            },
            ...result.routesData,
          ],
        };
      },
      this.store,
    );
  };

  get length() {
    return this.store.routesData.length;
  }

  get templates() {
    return this.store.templates;
  }

  get client() {
    return `[${this.store.routesData
      .map(
        ({
          routePath,
          chunkName,
          filePath,
        }: $ElementType<
          $PropertyType<dataType, 'routesData'>,
          number,
        >): string =>
          `{ ${[
            'exact: true',
            `path: ${JSON.stringify(routePath)}`,
            `component: { ${[
              `loader: () => import(/* webpackChunkName: "${chunkName}" */ '${filePath}')`,
              `chunkName: '${chunkName}'`,
            ].join(', ')} }`,
          ].join(', ')} }`,
      )
      .join(', ')}] ||`;
  }

  get server(): $ReadOnlyArray<
    $ElementType<$PropertyType<propsType, 'routesData'>, number>,
  > {
    return this.store.routesData.map(
      ({
        routePath,
        chunkName,
        filePath,
      }: $ElementType<$PropertyType<dataType, 'routesData'>, number>) => ({
        exact: true,
        path: routePath,
        component: {
          loader: async () => ({
            default: requireModule(filePath),
          }),
          chunkName,
        },
      }),
    );
  }
}
