// @flow

import React, {
  type Node as NodeType,
  type AbstractComponent as AbstractComponentType,
} from 'react';
import { Box, Text } from 'ink';

export type propsType = {|
  event: 'success' | 'error',
  message: string,
|};

/** @react show message */
const Message = ({ event, message }: propsType): NodeType => {
  switch (event) {
    case 'success':
      return (
        <Box>
          <Text color="green">✔ </Text>

          <Text>{message}</Text>
        </Box>
      );

    case 'error':
      return (
        <Box>
          <Text color="red">✖ </Text>

          <Text>{message}</Text>
        </Box>
      );

    default:
      return <Text> {message}</Text>;
  }
};

export default (React.memo<propsType>(
  Message,
): AbstractComponentType<propsType>);
