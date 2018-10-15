// @flow

export default (settingsName: string): ?{} => {
  switch (settingsName) {
    case 'log':
      return require('./settings/log');
    default:
      return null;
  }
};
