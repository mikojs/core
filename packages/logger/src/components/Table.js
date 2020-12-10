// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Box, Text } from 'ink';

export type eventType = 'success' | 'fail' | 'end';
export type propsType = {|
  logs: {|
    [string]: {|
      [eventType]: $ReadOnlyArray<string>,
    |},
  |},
|};

/** @react table */
const Table = ({ logs }: propsType) => (
  <Box>
    <Text>{JSON.stringify(logs)}</Text>
  </Box>
);

export default (React.memo<propsType>(Table): AbstractComponentType<propsType>);
