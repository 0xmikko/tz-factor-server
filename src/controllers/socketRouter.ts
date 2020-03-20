import SocketIO, {Socket} from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../config/config';
import {tokenData} from '../core/profile';

export type socketListeners = Record<string, (...args: any[]) => Promise<void>>;

export interface SocketController {
  namespace: string;
  getListeners: (
    socket: Socket,
    userId: string,
    role: string,
  ) => socketListeners;
}

export interface SocketWithToken extends SocketIO.Socket {
  tData: tokenData;
}

export class SocketRouter {
  private readonly sockets: Record<string, Socket>;
  private _controllers: SocketController[];

  constructor(controllers: SocketController[]) {
    this.sockets = {};
    this._controllers = [...controllers];
    console.log(this._controllers);
  }

  connect(io: SocketIO.Server) {
    io.on(
      'connection',
      socketioJwt.authorize({
        secret: config.jwt_secret,
        timeout: 15000, // 15 seconds to send the authentication message
        decodedPropertyName: 'tData',
      }),
    ).on('authenticated', this._onNewAuthSocket.bind(this));
    console.log(this._controllers);
  }

  private _onNewAuthSocket(socket: SocketWithToken) {
    console.log(this);

    const userId = socket.tData.user_id;
    const role = socket.tData.role;

    // Add new socket in sockets connection array
    this.sockets[userId] = socket;
    console.log(`[SOCKET.IO] : user ${userId} connected`);

    // Middleware to show all incoming requests
    socket.use((packet, next) => {
      console.log(`[SOCKET.IO] : INCOMING REQUEST ${packet[0]}`);
      next();
    });

    // Add delete listener
    socket.on('disconnect', () => {
      //this socket is authenticated, we are good to handle more events from it.
      console.log(`buy ${userId} with role ${role}`);
      delete this.sockets[userId];
    });

    // Add listeners from all controllers
    for (const controller of this._controllers) {
      const listeners = controller.getListeners(socket, userId, role);

      const {namespace} = controller;
      Object.entries(listeners).map(l => {
        const event = l[0];
        const handler = l[1];
        socket.on(
          namespace + ':' + event,
            this.loggerMiddleware(namespace, event, handler),
        );
      });
      console.log(`[SOCKET.IO] : ${namespace} | listeners connected`);
    }
  }

  private loggerMiddleware(
    namespace: string,
    event: string,
    fn: (...args: any[]) => Promise<void>,
  ): any {
    return async function(...args : any[]) {
      const start = Date.now();
      await fn(...args);
      const finish = Date.now();
      console.log(
        `[SOCKET.IO] : ${namespace} | ${event} | ${finish - start} ms`,
      );
    };
  }
}
