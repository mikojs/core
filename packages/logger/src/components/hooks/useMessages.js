// @flow

import { useState, useEffect } from 'react';

import { type propsType as messagePropsType } from '../Message';

import useColors from './useColors';

type messagesType = {|
  ...$Diff<messagePropsType, {| color: mixed, message: mixed |}>,
  messages: $ReadOnlyArray<messagePropsType>,
|};

type messagesStateType = $ReadOnlyArray<{|
  ...messagePropsType,
  key: number,
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

  useEffect(() => {
    setMessages([
      ...messages,
      ...originalMessages.map((message: messagePropsType, index: number) => ({
        key: messages.length + index,
        name,
        event,
        color: colors[name],
        message:
          typeof message === 'string'
            ? message
            : JSON.stringify(message, null, 2),
      })),
    ]);
  }, [name, event, originalMessages]);

  return messages;
};
