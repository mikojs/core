// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

const ErrorComponent = () => {
  throw new Error('custom error');
};

export default ErrorComponent;
