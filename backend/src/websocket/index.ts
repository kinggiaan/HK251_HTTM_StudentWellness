import type { Server, Socket } from 'socket.io';

import { logger } from '../config';

export type AppSocketServer = Server;

const registerWebsocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Client connected to websocket');

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'Client disconnected from websocket');
    });
  });
};

export default registerWebsocket;

