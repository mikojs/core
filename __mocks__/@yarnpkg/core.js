const core = jest.requireActual('@yarnpkg/core');

Object.keys(core).forEach(key => {
  exports[key] =
    key !== 'execUtils'
      ? core[key]
      : {
          pipevp: jest.fn(),
        };
});
