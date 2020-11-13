// @flow

import chalk from 'chalk';

/**
 * @param {string} name - command name
 * @param {Error} err - err message
 *
 * @return {string} - new error message
 */
export default (name: string, err: Error): string =>
  /^Cannot find module.*main.js/.test(err.message)
    ? chalk`Could not find a valid build. Try using {green ${name} build} before running the server`
    : err.message.replace(/\nRequire stack:(.|\n)*/, '');
