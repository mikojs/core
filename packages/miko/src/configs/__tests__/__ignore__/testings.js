// @flow

export const mockFunc = jest.fn<
  [$ReadOnlyArray<string>],
  $ReadOnlyArray<string>,
>();

export const originalConfigs = {
  'key-a': mockFunc,
  'key-b': [mockFunc, {}],
  'key-c': {
    'key-a': mockFunc,
    'key-b': [mockFunc, {}],
    'key-c': mockFunc,
    'key-d': [mockFunc, {}],
  },
  'key-c:key-a': mockFunc,
  'key-c:key-b': [mockFunc, {}],
  'key-c:key-c': [mockFunc, {}],
  'key-c:key-d': mockFunc,
  'key-d': {
    'key-a': {
      'key-a': mockFunc,
    },
  },
};

export default [
  ['key-a', 1],
  ['key-b', 1],
  ['key-c:key-a', 2],
  ['key-c:key-b', 2],
  ['key-c:key-c', 2],
  ['key-c:key-d', 2],
  ['key-d:key-a:key-a', 1],
];
