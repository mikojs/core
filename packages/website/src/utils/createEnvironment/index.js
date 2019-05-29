// @flow

export const { initEnvironment, createEnvironment } = (!process.env.BROWSER
  ? require('./server')
  : require('./client')
).default;
