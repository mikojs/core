// @flow

import { useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { type propsType as messagePropsType } from '../Message';

type colorsType = {|
  [string]: string,
|};

type messageType = string | number | {} | $ReadOnlyArray<messageType>;

export type getMessagesArguType = {|
  ...$Diff<messagePropsType, {| color: mixed, message: mixed |}>,
  messages: $ReadOnlyArray<messageType>,
|};

export type getMessagesReturnType = $ReadOnlyArray<{|
  ...messagePropsType,
  key: string,
|}>;

type getMessagesType = (argu: getMessagesArguType) => getMessagesReturnType;

/**
 * @return {getMessagesType} - get messages function
 */
export default (): getMessagesType => {
  const colorsRef = useRef<colorsType>({});

  return useCallback(
    ({ name, event, messages }: getMessagesArguType): getMessagesReturnType => {
      if (!colorsRef.current[name])
        colorsRef.current[name] = `#${Math.floor(
          Math.random() * 16777215,
        ).toString(16)}`;

      return messages.map((message: messageType) => ({
        key: uuid(),
        name,
        event,
        color: colorsRef.current[name],
        message:
          typeof message === 'string'
            ? message
            : JSON.stringify(message, null, 2),
      }));
    },
    [],
  );
};
