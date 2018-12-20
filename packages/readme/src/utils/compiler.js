// @flow

import debug from 'debug';
import chalk from 'chalk';

import logger from './logger';
import generateContent from './generateContent';

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
 */
const traverse = (
  { type, children, value: endComment }: nodeType,
  file: fileType,
) => {
  if (children) children.forEach((node: nodeType) => traverse(node, file));

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

    file.contents = file.contents.replace(
      new RegExp(`${startComment}\n(.|\n)*${endComment}`),
      `${startComment}\n${generateContent(startKey)}\n${endComment}`,
    );
  }
};

export default (node: nodeType, file: fileType): string => {
  debugLog({ node, file });
  traverse(node, file);

  return String(file.contents);
};
