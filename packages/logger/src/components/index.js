// @flow

import EventEmitter from 'events';

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';

type propsType = {|
  events: EventEmitter,
|};

/** @react logger controller */
const Logger = () => <Text>Hello world</Text>;

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
