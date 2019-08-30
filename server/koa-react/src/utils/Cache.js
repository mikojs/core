// @flow

import path from 'path';

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

import { d3DirTree, requireModule } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import { type propsType as rootPropsType } from 'components/Root';

import NotFound from 'templates/NotFound';

export type handlerType = (
  routesData: $PropertyType<rootPropsType, 'routesData'>,
) => $PropertyType<rootPropsType, 'routesData'>;

type fileType =
  | 'document'
  | 'main'
  | 'loading'
  | 'error'
  | 'not-found'
  | 'page';

const debugLog = debug('react:Cache');

/**
 * @example
 * getLoader('/file-path')
 *
 * @param {string} filePath - file path to get loader
 *
 * @return {Function} - loader
 */
const getLoader = (filePath: string) => async () => ({
  default: requireModule(filePath),
});

/** Cache to store the parse data */
export default class Cache {
  store: {|
    folderPath: string,
    handler: handlerType,
    basename: ?string,
    exclude: ?RegExp,
  |};
  routesData: $PropertyType<rootPropsType, 'routesData'>;
  document: string;
  main: string;
  loading: string;
  error: string;
  cacheDir: $Call<findCacheDir>;

  /**
   * @example
   * new cache('/folder-path', () => {})
   *
   * @param {string} folderPath - folder path
   * @param {Function} handler - handler url path
   * @param {string} basename - basename to join url
   * @param {RegExp} exclude - exclude file path
   */
  constructor(
    folderPath: string,
    handler: handlerType,
    basename?: string,
    exclude?: RegExp,
  ) {
    this.store = {
      folderPath,
      handler,
      basename,
      exclude,
    };
    this.routesData = [
      {
        exact: true,
        path: [`${basename || ''}/*`],
        component: {
          filePath: path.resolve(__dirname, '../templates/NotFound.js'),
          chunkName: `pages${basename || ''}/notFound`,
          loader: async () => ({
            default: NotFound,
          }),
        },
      },
    ];
    this.document = path.resolve(__dirname, '../templates/Document.js');
    this.main = path.resolve(__dirname, '../templates/Main.js');
    this.loading = path.resolve(__dirname, '../templates/Loading.js');
    this.error = path.resolve(__dirname, '../templates/Error.js');
    this.cacheDir = findCacheDir({
      name: basename || 'no-basename',
      thunk: true,
    });

    d3DirTree(folderPath, {
      extensions: /.jsx?$/,
      exclude,
    })
      .leaves()
      .forEach(({ data: { name, path: filePath } }: d3DirTreeNodeType) => {
        this.handleFilePath(
          filePath,
          (type: fileType, relativePath: string) => {
            switch (type) {
              case 'document':
              case 'main':
              case 'loading':
              case 'error':
              case 'not-found':
                break;

              default:
                this.routesData = [
                  {
                    exact: true,
                    path: this.getPath(relativePath),
                    component: {
                      filePath,
                      chunkName: `pages${basename || ''}/${relativePath}`,
                      loader: getLoader(filePath),
                    },
                  },
                  ...this.routesData,
                ];
                break;
            }
          },
        );
      });

    this.routesData = handler(this.routesData);
    this.writeFile('routesData.js', this.clientRoutesData());
    this.writeFile(
      'Main.js',
      `module.exports = require('${this.main}').default || require('${this.main}');`,
    );
    this.writeFile(
      'Loading.js',
      `module.exports = require('${this.loading}').default || require('${this.loading}');`,
    );
    this.writeFile(
      'Error.js',
      `module.exports = require('${this.error}').default || require('${this.error}');`,
    );
  }

  /**
   * @example
   * cache.handleFilePath('/file-path', () => {})
   *
   * @param {string} filePath - file path
   * @param {Function} callback - callback function to handle the file
   */
  +handleFilePath = (
    filePath: string,
    callback: (type: fileType, relativePath: string) => void,
  ) => {
    const { folderPath } = this.store;
    const relativePath = path
      .relative(folderPath, filePath)
      .replace(/\.jsx?$/, '');

    debugLog(relativePath);

    if (/^\.templates/.test(relativePath))
      switch (relativePath.replace(/^\.templates\//, '')) {
        case 'Document':
          this.document = filePath;
          callback('document', relativePath);
          return;

        case 'Main':
          this.main = filePath;
          callback('main', relativePath);
          return;

        case 'Loading':
          this.loading = filePath;
          callback('loading', relativePath);
          return;

        case 'Error':
          this.error = filePath;
          callback('error', relativePath);
          return;

        case 'NotFound':
          this.routesData = [
            ...this.routesData.slice(0, this.routesData.length - 1),
            {
              ...this.routesData[this.routesData.length - 1],
              component: {
                ...this.routesData[this.routesData.length - 1].component,
                filePath,
                loader: getLoader(filePath),
              },
            },
          ];
          callback('not-found', relativePath);
          return;

        default:
          return;
      }

    callback('page', relativePath);
  };

  /**
   * @example
   * cache.getPath('/relative-path')
   *
   * @param {string} relativePath - relative path
   *
   * @return {Array} - path for react-router-dom
   */
  +getPath = (relativePath: string): $ReadOnlyArray<string> => {
    const { basename } = this.store;
    const routePath = [
      relativePath
        .replace(/(\/?index)?$/, '')
        .replace(/^/, '/')
        .replace(/\/\[([^[\]]*)\]/g, '/:$1'),
    ];

    debugLog(routePath);

    return !basename
      ? routePath
      : routePath.map((prevPath: string) => `${basename}${prevPath}`);
  };

  /**
   * @example
   * cache.writeFile('filename', 'content')
   *
   * @param {string} filename - filename to write in the cache dir
   * @param {string} content - file content
   */
  +writeFile = (filename: string, content: string) => {
    debugLog(filename, content);
    outputFileSync(this.cacheDir(filename), content);
  };

  /**
   * @example
   * cache.clientRoutesData()
   *
   * @return {string} - client routes data string
   */
  +clientRoutesData = () =>
    `module.exports = [${this.routesData
      .map(
        ({
          path: routePath,
          component: { filePath, chunkName },
        }: $ElementType<
          $PropertyType<rootPropsType, 'routesData'>,
          number,
        >): string =>
          `{ ${[
            'exact: true',
            `path: ${JSON.stringify(routePath)}`,
            `component: { ${[
              `chunkName: '${chunkName}'`,
              `loader: () => import(/* webpackChunkName: "${chunkName}" */ '${filePath}')`,
            ].join(', ')} }`,
          ].join(', ')} }`,
      )
      .join(', ')}]`;

  /**
   * @example
   * cache.update('filePath')
   *
   * @param {string} filePath - file path to watch
   */
  +update = (filePath: string) => {
    const { folderPath, basename, exclude, handler } = this.store;

    if (exclude && exclude.test(filePath)) return;

    if (!new RegExp(path.resolve(folderPath)).test(filePath)) return;

    this.handleFilePath(filePath, (type: fileType, relativePath: string) => {
      switch (type) {
        case 'document':
          break;

        case 'main':
          this.writeFile(
            'Main.js',
            `module.exports = require('${this.main}').default || require('${this.main}');`,
          );
          break;

        case 'loading':
          this.writeFile(
            'Loading.js',
            `module.exports = require('${this.loading}').default || require('${this.loading}');`,
          );
          break;

        case 'error':
          this.writeFile(
            'Error.js',
            `module.exports = require('${this.error}').default || require('${this.error}');`,
          );
          break;

        case 'not-found':
          this.writeFile('routesData.js', this.clientRoutesData());
          break;

        default:
          const chunkName = `pages${basename || ''}/${relativePath}`;

          this.routesData = [
            {
              exact: true,
              path: this.getPath(relativePath),
              component: {
                filePath,
                chunkName,
                loader: getLoader(filePath),
              },
            },
            ...this.routesData.filter(
              ({
                component: { chunkName: routeChunkName },
              }: $ElementType<
                $PropertyType<rootPropsType, 'routesData'>,
                number,
              >) => routeChunkName !== chunkName,
            ),
          ];
          this.routesData = handler(this.routesData);
          this.writeFile('routesData.js', this.clientRoutesData());
          break;
      }
    });
  };
}
