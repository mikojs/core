// @flow

export default jest.fn().mockReturnValue({
  server: {
    on: jest.fn(),
  },
});
