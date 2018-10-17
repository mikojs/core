// @flow

export default (settingsName: string): ?{} => {
  switch (settingsName) {
    case 'log':
      return require('./settings/log');
    case 'ora':
      return require('./settings/ora');
    default:
      return null;
  }
};
