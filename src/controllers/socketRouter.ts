import SocketIO, {Socket} from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../config/config';
import {tokenData} from '../core/profile';
import {Role} from "../core/company";
import {SCManager} from "../repository/smartContractManager";

export type socketListeners = Record<string, (...args: any[]) => Promise<void>>;

export interface SocketController {
  namespace: string;
  getListeners: (
    socket: Socket,
    userId: string,
    role: Role,
  ) => socketListeners;
  update: () => Promise<void>;
}

export interface SocketWithToken extends SocketIO.Socket {
  tData: tokenData;
}

export class SocketRouter {
  private readonly socketsPool: Record<string, Socket> = {};
  private readonly _controllers: SocketController[];

  constructor(controllers: SocketController[]) {
    this._controllers = [...controllers];
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
  }

  // Runs process of updating information on all controllers
  update() : Promise<void> {
    return new Promise<void>(async (resolve) => {
      await SCManager.getManager().updateData();
      for(const c of this._controllers) {
        console.log("START=>>>", c.namespace)
        await c.update();
        console.log("FINISH=>>>", c.namespace)
      }
      resolve()
    })
  }

  // Connect new socket to pool
  private _onNewAuthSocket(socket: SocketWithToken) {
    console.log(this);

    const userId = socket.tData.user_id;
    const role = socket.tData.role;

    // Add new socket in socketsPool connection array
    this.socketsPool[userId] = socket;
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
      delete this.socketsPool[userId];
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
