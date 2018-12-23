// @flow

import unified from 'unified';
import markdown from 'remark-parse';
import debug from 'debug';

import logger from './logger';

type nodeType = {
  type: string,
  value: string,
  children?: $ReadOnlyArray<nodeType>,
};

type fileType = {
  contents: string,
};

type ctxType = {
  rootPath: string,
  pkg: { [string]: string },
};

const debugLog = debug('readme:parser');

/**
 * @example
 * traverse(node, file)
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

  // TODO parser and checking
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
