// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

export type propsType = {|
  name: string,
  event: 'start' | 'success' | 'error' | 'info' | 'warn' | 'log',
  color: string,
  message: string,
|};

const symbols = {
  start: <Spinner type="dots" />,
  success: <Text color="green">&#10003;</Text>,
  error: <Text color="red">&#10008;</Text>,
  info: <Text color="blue">&#8560;</Text>,
  warn: <Text color="yellow">&#8560;</Text>,
  log: <Text> </Text>,
};

/** @react show message */
const Message = ({ name, event, color, message }: propsType) => (
  <Box>
    <Text>
      {symbols[event]}

      <Text color={color}> {name} </Text>

      {message}
    </Text>
  </Box>
);

export default (React.memo<propsType>(
  Message,
): AbstractComponentType<propsType>);
