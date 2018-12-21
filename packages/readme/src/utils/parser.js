// @flow

import chalk from 'chalk';
import unified from 'unified';
import markdown from 'remark-parse';
import debug from 'debug';

import logger from './logger';

import contents from 'contents';

import type { ctxType } from 'contents';

type nodeType = {
  type: string,
  value: string,
  children?: $ReadOnlyArray<nodeType>,
};

type fileType = {
  contents: string,
};

const debugLog = debug('readme:compiler');
const commentArray = [];

/**
 * @example
 * traverse(node, file)
 *
 * @param {Object} node - unified node
 * @param {Object} file - unified file
 * @param {Object} ctx - context
 */
const traverse = (
  { type, children, value: endComment }: nodeType,
  file: fileType,
  ctx: ctxType,
) => {
  if (children) children.forEach((node: nodeType) => traverse(node, file, ctx));

  if (type === 'html') {
    const [endKey, flag] = endComment
      .replace(/^<!-- readme.(.*) -->$/, '$1')
      .split(/\./);

    if (!endKey || !flag) return;

    if (commentArray.length === 0) {
      commentArray.push({
        startKey: endKey,
        startComment: endComment,
      });
      return;
    }

    const { startKey, startComment } = commentArray.pop();

    if (startKey !== endKey || flag !== 'end')
      logger.fail(
        chalk`{red <!-- readme.${startKey}.end -->} should be after {green <!-- readme.${startKey}.start -->}`,
      );

    const newContent = contents(startKey, ctx);

    file.contents = file.contents.replace(
      new RegExp(`${startComment}\n(.|\n)*${endComment}`),
      `${startComment}\n${!newContent ? '' : `${newContent}\n`}${endComment}`,
    );
  }
};

export default (readme: string, ctx: ctxType) =>
  new Promise<string>(resolve => {
    const processor = unified().use(markdown);

    processor.Compiler = (node: nodeType, file: fileType): string => {
      debugLog({ node, file });
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
