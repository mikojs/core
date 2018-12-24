// @flow

import unified from 'unified';
import markdown from 'remark-parse';
import debug from 'debug';

import logger from './logger';
import badges from './badges';

type nodeType = {
  type: string,
  value: string,
  children?: $ReadOnlyArray<nodeType>,
};

export type fileType = {
  contents: string,
};

export type ctxType = {
  rootPath: string,
  pkg: {
    [string]: string,
    engines: {
      [string]: string,
    },
  },
  badges: boolean,
};

const debugLog = debug('readme:parser');

/**
 * @example
 * traverse(node, file, ctx)
 *
 * @param {Object} node - unified node
 * @param {Object} file - unified file
 * @param {Object} ctx - context
 */
const traverse = (
  { type, children, value }: nodeType,
  file: fileType,
  ctx: ctxType,
) => {
  if (children) children.forEach((node: nodeType) => traverse(node, file, ctx));

  switch (type) {
    case 'html':
      if (value === '<!-- readme.badges.start -->') ctx.badges = true;
      else if (ctx.badges && value === '<!-- readme.badges.end -->') {
        ctx.badges = false;
        badges(file, ctx);
      }

      return;

    default:
      return;
  }
};

export default (readme: string, ctx: ctxType) =>
  new Promise<string>(resolve => {
    const processor = unified().use(markdown);

    debugLog({
      readme,
      ctx,
    });

    processor.Compiler = (node: nodeType, file: fileType): string => {
      traverse(node, file, ctx);

      return String(file.contents);
    };

    processor.process(readme, (err: mixed, file: fileType) => {
      if (err) {
        debugLog(err);
        logger.fail('Parser file error');
      }

      resolve(file.contents);
    });
  });
