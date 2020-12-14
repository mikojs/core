// @flow

import React, {
  type Node as NodeType,
  type AbstractComponent as AbstractComponentType,
} from 'react';
import { Box, Text } from 'ink';

export type propsType = {|
  event: 'success' | 'error' | 'info' | 'warn' | 'log',
  message: string,
|};

/** @react show message */
const Message = ({ event, message }: propsType): NodeType => {
  switch (event) {
    case 'success':
      return (
        <Box>
          <Text color="green">&#10003; </Text>

          <Text>{message}</Text>
        </Box>
      );

    case 'error':
      return (
        <Box>
          <Text color="red">&#10008; </Text>

          <Text>{message}</Text>
        </Box>
      );

    case 'info':
      return (
        <Box>
          <Text color="blue">&#8560; </Text>

          <Text>{message}</Text>
        </Box>
      );

    case 'warn':
      return (
        <Box>
          <Text color="yellow">&#8560; </Text>

          <Text>{message}</Text>
        </Box>
      );

    default:
      return <Text>  {message}</Text>;
  }
};

export default (React.memo<propsType>(
  Message,
): AbstractComponentType<propsType>);
