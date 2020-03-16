// @flow

export const start = jest.fn<$ReadOnlyArray<void>, void>();
export const func = jest.fn<$ReadOnlyArray<stream$Writable>, mixed>();
export const end = jest.fn<$ReadOnlyArray<void>, void>();
