import SocketIO, {Socket} from 'socket.io';
import socketioJwt from 'socketio-jwt';
import {config} from '../config/config';
import {tokenData} from '../core/profile';
import {injectable} from 'inversify';

export interface SocketWithToken extends SocketIO.Socket {
  tData: tokenData;
}

@injectable()
export class SocketController {
  private sockets: Record<string, Socket>;

  constructor(private thread: string) {
    this.sockets = {};
  }

  connect(io: SocketIO.Server) {
    const nsp = io.of(this.thread);
    nsp
      .on(
        'connection',
        socketioJwt.authorize({
          secret: config.jwt_secret,
          timeout: 15000, // 15 seconds to send the authentication message
          decodedPropertyName: 'tData',
        }),
      )
      .on('authenticated', (socket: SocketWithToken) => {
        //this socket is authenticated, we are good to handle more events from it.

        const userId = socket.tData.user_id;
        const role = socket.tData.role;
        this.addConnectionToPool(socket, userId, role);

        console.log(`hello! ${socket.tData.user_id}`);
      })
      .on('disconnect', () => {
        //this socket is authenticated, we are good to handle more events from it.

        console.log(`buye!`);
      });

    console.log('Listen socket on ', this.thread);
  }

  addConnectionToPool(socket: Socket, userId: string, role: string) {
    if (!userId || userId === '') throw Error('Cant assign empty user');

    this.sockets[userId] = socket;
    socket.on('disconnect', () => {
      delete this.sockets[userId];
    });
  }
}
