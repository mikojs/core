#! /usr/bin/env node
// @flow

import net from 'net';

const { log } = console;
const server = net.createServer((socket: net.Socket) => {
  socket.setEncoding('utf8');
  socket.on('data', log);
});

server.listen(parseInt(process.env.DEBUG_PORT, 10), () => {
  log('Debug server start');
});
