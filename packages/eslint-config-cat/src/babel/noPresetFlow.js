// @flow

export default (context: {}): {
  ReturnStatement: (node: {}) => void,
} => ({
  ReturnStatement: (node: {}) => {
    console.log(node); // eslint-disable-line
  },
});
