// @flow

import Events from 'events';

const event = new Events();

export const mockCallback = jest.fn<$ReadOnlyArray<void>, void>();

event.on('test', mockCallback);

export default event;
