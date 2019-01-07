// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';

import createLogs from '../createLogs';

jest.mock('fs');

describe('create logs', () => {
  test.each`
    exist
    ${true}
    ${false}
  `('with logs folder exist($exist)', ({ exist }: { exist: boolean }) => {
    fs.exist = exist;

    const result = createLogs();

    expect(result[0]).toBe('combined');
    expect(result[1].stream).toMatch(/logs\/(\d)*\.log$/);
  });
});
