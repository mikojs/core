// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import Divider from 'ink-divider';

import Message, { type propsType as messagePropsType } from './Message';
import Loading from './Loading';

export type propsType = {|
  logs: {|
    [string]: {|
      loading: false | string,
      messages: $ReadOnlyArray<messagePropsType>,
    |},
  |},
|};

/** @react logger */
const Logger = ({ logs }: propsType) =>
  Object.keys(logs).map(
    (name: string, index: number, names: $ReadOnlyArray<string>) => (
      <React.Fragment key={name}>
        {index === 0 && names.length <= 1 ? null : (
          <Divider title={name} width={100} />
        )}

        {logs[name].messages.map(
          (messageProps: messagePropsType, messageIndex: number) => (
            <Message {...messageProps} key={messageIndex} />
          ),
        )}

        {!logs[name].loading ? null : <Loading message={logs[name].loading} />}
      </React.Fragment>
    ),
  );

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
