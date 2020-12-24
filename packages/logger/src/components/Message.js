// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Box, Text } from 'ink';

export type propsType = {|
  name: string,
  color: string,
  event: 'success' | 'error' | 'info' | 'warn' | 'log',
  message: string,
|};

const symbols = {
  success: <Text color="green">&#10003; </Text>,
  error: <Text color="red">&#10008; </Text>,
  info: <Text color="blue">&#8560; </Text>,
  warn: <Text color="yellow">&#8560; </Text>,
  log: <Text>{'  '}</Text>,
};

/** @react show message */
const Message = ({ name, color, event, message }: propsType) => (
  <Box>
    <Text>
      {symbols[event]}

      <Text color={color}>{name} </Text>

      {message}
    </Text>
  </Box>
);

export default (React.memo<propsType>(
  Message,
): AbstractComponentType<propsType>);
