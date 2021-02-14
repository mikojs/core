// @flow

import { useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { type propsType as messagePropsType } from '../Message';

type colorsType = {|
  [string]: string,
|};

type messageType = string | number | {} | $ReadOnlyArray<messageType>;

export type getMessagesArguType = {|
  name: $PropertyType<messagePropsType, 'name'>,
  event: $PropertyType<messagePropsType, 'event'> | 'debug',
  messages: $ReadOnlyArray<messageType>,
|};

export type getMessagesReturnType = $ReadOnlyArray<{|
  ...messagePropsType,
  key: string,
|}>;

type getMessagesType = (argu: getMessagesArguType) => getMessagesReturnType;

const COLORS = ['cyan', 'magenta', 'blue', 'yellow', 'green', 'red'];

/**
 * @return {getMessagesType} - get messages function
 */
export default (): getMessagesType => {
  const colorsRef = useRef<colorsType>({});

  return useCallback(
    ({ name, event, messages }: getMessagesArguType): getMessagesReturnType => {
      if (!colorsRef.current[name])
        colorsRef.current[name] =
          COLORS[Object.keys(colorsRef.current).length % COLORS.length];

      return event === 'debug' &&
        process.env.DEBUG &&
        !new RegExp(process.env.DEBUG.replace(/\*/g, '.*')).test(name)
        ? []
        : messages.map((message: messageType) => ({
            key: uuid(),
            name: event === 'debug' ? name : name.replace(/:.*$/, ''),
            event: event === 'debug' ? 'log' : event,
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
