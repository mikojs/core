// @flow

const on = jest.fn().mockImplementation(() => ({
  on,
}));

export default {
  watch: jest.fn().mockReturnValue({
    on,
  }),
};
