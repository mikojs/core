export default {
  cosmiconfigSync: jest.fn().mockReturnValue({
    search: jest.fn().mockReturnValue({
      config: null,
    }),
  }),
};
