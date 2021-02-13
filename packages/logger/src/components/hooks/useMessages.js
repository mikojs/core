// @flow

import { useState, useEffect, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { type propsType as messagePropsType } from '../Message';

import useColors from './useColors';

export type messagesType = {|
  ...$Diff<messagePropsType, {| color: mixed, message: mixed |}>,
  messages: $ReadOnlyArray<messagePropsType>,
|};

export type messagesStateType = $ReadOnlyArray<{|
  ...messagePropsType,
  key: string,
|}>;

/**
 * @param {messagesType} argu - message arguments
 *
 * @return {messagesStateType} - message state
 */
export default ({
  name,
  event,
  messages: originalMessages,
}: messagesType): messagesStateType => {
  const colors = useColors(name);
  const [messages, setMessages] = useState<messagesStateType>([]);
  const [loadingMessages, setLoadingMessages] = useState<messagesStateType>([]);

  useEffect(() => {
    switch (event) {
      case 'start':
        setLoadingMessages([
          ...loadingMessages.filter(
            (loadingMessage: $ElementType<messagesStateType, number>) =>
              loadingMessage.name === name,
          ),
          ...originalMessages.map((message: messagePropsType) => ({
            key: uuid(),
            name,
            event,
            color: colors[name],
            message:
              typeof message === 'string'
                ? message
                : JSON.stringify(message, null, 2),
          })),
        ]);
        break;

      default:
        setMessages([
          ...messages,
          ...originalMessages.map((message: messagePropsType) => ({
            key: uuid(),
            name,
            event,
            color: colors[name],
            message:
              typeof message === 'string'
                ? message
                : JSON.stringify(message, null, 2),
          })),
        ]);
        break;
    }
  }, [name, event, originalMessages]);

  return useMemo(() => [...messages, ...loadingMessages], [
    messages,
    loadingMessages,
  ]);
};
