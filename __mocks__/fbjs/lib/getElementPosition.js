// @flow

export default jest
  .fn<$ReadOnlyArray<void>, void>()
  .mockReturnValue({ width: 0, height: 0 });
