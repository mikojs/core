// @flow

export type messageType = string | {};

/**
 * @param {messageType} message - log message
 *
 * @return {string} - message string
 */
export default (message: messageType): string =>
  typeof message === 'string' ? message : JSON.stringify(message, null, 2);
