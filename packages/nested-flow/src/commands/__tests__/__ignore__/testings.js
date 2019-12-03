// @flow

export default [
  ['Launching Flow server for /path', 1, null],
  ['Spawned flow server (pid=pid)', 1, null],
  ['Logs will go to /path', 1, null],
  ['Monitor logs will go to /path', 1, null],
  ['Started a new flow server', 1, 'Started a new flow server: \\'],
  ['Please wait. (...skip test)', 1, 'Please wait. (...skip test): |'],
  ['Please wait. (...skip test)', 1, 'Please wait. (...skip test): /'],
  ['Please wait. (...skip test)', 1, 'Please wait. (...skip test): -'],
  ['Please wait. (...skip test)', 1, 'Please wait. (...skip test): \\'],
  ['Error --- a.js', 1, ''],
  ['No errors!', 0, null],
  [
    'Error --- b.js',
    1,
    'Error --- packages/nested-flow/src/commands/__tests__/a.js',
  ],
  [
    `
aaaa
bbbb`,
    0,
    null,
  ],
  [
    'Error --- c.js',
    1,
    `Error --- packages/nested-flow/src/commands/__tests__/b.js
aaaa
bbbb`,
  ],
];
