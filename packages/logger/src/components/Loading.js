// @flow

import React, {
  type AbstractComponent as AbstractComponentType,
  type Node as NodeType,
  useState,
  useEffect,
} from 'react';
import { Box, Text } from 'ink';

type propsType = {|
  message: string,
|};

const fps = 1000 / 24;
const symbols = [
  '&#10251;',
  '&#10265;',
  '&#10297;',
  '&#10296;',
  '&#10300;',
  '&#10292;',
  '&#10278;',
  '&#10279;',
  '&#10247;',
  '&#10255;',
];

/** @react loading message */
const Loading = ({ message }: propsType): NodeType => {
  const [index, setIndex] = useState(0);

  useEffect((): (() => void) => {
    const timeout = setTimeout(() => {
      setIndex(index >= symbols.length - 1 ? 0 : index + 1);
    }, fps);

    return () => {
      clearTimeout(timeout);
    };
  }, [index]);

  return (
    <Box>
      <Text>{symbols[index]} </Text>

      <Text>{message}</Text>
    </Box>
  );
};

export default (React.memo<propsType>(
  Loading,
): AbstractComponentType<propsType>);
