// @flow

/** not need to test */
/* istanbul ignore next */
process.on('unhandledRejection', (error: mixed) => {
  throw error;
});
