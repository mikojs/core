import chalk from 'chalk';

export default (isSuccess, packageName, message) => (
  isSuccess ?
    console.log(chalk`{bgGreen  ${packageName} } ${message} {cyan done}`) :
    console.log(chalk`{bgRed  ${packageName} } ${message} {cyan fail}`)
);
