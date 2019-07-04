// @flow

// TODO component should be ignored
// eslint-disable-next-line jsdoc/require-jsdoc
const ErrorComponent = () => {
  throw new Error('custom error');
};

export default ErrorComponent;
