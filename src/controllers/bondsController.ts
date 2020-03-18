import {Bond, BondsServiceI} from '../core/bonds';
import {Socket, Server} from 'socket.io';
import {SocketController} from './socketController';

export class BondsController extends SocketController {
  constructor(private _bondsService: BondsServiceI, io: Server) {
    super('/bonds');
  }

  addConnectionToPool(socket: Socket, userId: string, role: string) {
    super.addConnectionToPool(socket, userId, role);

    socket.on('list', () => {
      this.listItems(userId).then(list => socket.emit('updateList', list));
    });

    socket.on('retrieve', (id: string) => {
      this.retrieveItem(userId, id).then(item => {
        socket.emit('updateDetails', item);
      });
    });
  }

  createBond(id: string, name: string) {
    this._bondsService.createBond(id, name);
  }

  retrieveItem(userID: string, id: string): Promise<Bond | undefined> {
    return this._bondsService.findById(userID, id);
  }

  listItems(userId: string): Promise<Bond[] | undefined> {
    return this._bondsService.list(userId);
  }
}
