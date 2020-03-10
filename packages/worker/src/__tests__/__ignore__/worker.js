// @flow

export const start = jest.fn<$ReadOnlyArray<void>, void>();
export const func = jest.fn<$ReadOnlyArray<void>, void | null | string>();
export const end = jest.fn<$ReadOnlyArray<void>, void>();
