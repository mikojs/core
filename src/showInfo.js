// @flow

import chalk from 'chalk';

export default (
  isSuccess: boolean,
  packageName: string,
  message: string,
// eslint-disable-next-line no-console
): void => console.log(
  isSuccess ?
    chalk`{bgGreen  ${packageName} } ${message} {cyan done}` :
    chalk`{bgRed  ${packageName} } ${message} {cyan fail}`
);
