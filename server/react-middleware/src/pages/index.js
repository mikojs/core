// @flow

import path from 'path';

import Router from 'koa-router';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import Document from './Document';
import Main from './Main';
import renderPage from './renderPage';

import { type entryType } from 'utils/getConfig';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

/** get pages */
class Pages {
  router = new Router();
  entry = {};
  Document = Document;
  Main = Main;

  /**
   * @example
   * pages.page('relative path', 'file path', urlPatterns => urlPatterns)
   *
   * @param {string} relativePath - relative path
   * @param {string} filePath - file path
   * @param {Function} redirect - redirect function
   */
  page = (relativePath: string, filePath: string, redirect: redirectType) => {
    this.entry[relativePath.replace(/\//g, '-')] = [filePath];

    redirect([relativePath.replace(/(index)?$/, '').replace(/^/, '/')]).forEach(
      (routerPath: string) => {
        this.router.get(
          routerPath,
          async (ctx: koaContextType, next: () => Promise<void>) => {
            ctx.type = 'text/html; charset=utf-8';
            ctx.body = await renderPage(
              ctx,
              this.Document,
              this.Main,
              require(filePath),
            );

            await next();
          },
        );
      },
    );
  };

  /**
   * @example
   * pages.get('folder path', urlPatterns => urlPatterns)
   *
   * @param {string} folderPath - folder path
   * @param {Function} redirect - redirect function
   *
   * @return {Object} - router and entry
   */
  get = (
    folderPath: string,
    redirect: redirectType,
  ): {
    router: Router,
    entry: entryType,
  } => {
    d3DirTree(folderPath, {
      extensions: /.jsx?$/,
    })
      .leaves()
      .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
        const relativePath = path
          .relative(folderPath, filePath)
          .replace(/\.jsx?$/, '');

        if (/^\.templates\//.test(relativePath))
          switch (relativePath.replace(/^\.templates\//, '')) {
            case 'Document':
              this.Document = require(filePath);
              return;

            case 'Main':
              this.Main = require(filePath);
              return;

            default:
              return;
          }

        this.page(relativePath, filePath, redirect);
      });

    return {
      router: this.router,
      entry: this.entry,
    };
  };
}

export default new Pages();
