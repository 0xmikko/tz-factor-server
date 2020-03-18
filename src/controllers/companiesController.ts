import {Company, CompaniesServiceI} from '../core/company';
import {Socket} from 'socket.io';
import {SocketController} from './socketController';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';

@injectable()
export class CompaniesController extends SocketController {
  private _service: CompaniesServiceI;

  constructor(
    @inject(TYPES.CompaniesService) issuersService: CompaniesServiceI,
  ) {
    super('/companies');
    this._service = issuersService;
  }

  addConnectionToPool(socket: Socket, userId: string, role: string) {
    super.addConnectionToPool(socket, userId, role);

    switch (role) {
      case 'A':
    }

    socket.on('list', () => {
      console.log('[SOCKET.IO] : CompaniesController : list request');
      this.listItems(userId).then(list => {
        socket.emit('updateList', list);
        console.log('[SOCKET.IO] : CompaniesController : list response');
      });
    });

    socket.on('retrieve', (id: string) => {
      console.log('[SOCKET.IO] : CompaniesController : retrieve request');
      this.retrieveItem(userId, id).then(data => {
        socket.emit('updateDetails', data);
        console.log('[SOCKET.IO] : CompaniesController : retrieve response', data);
      });
    });
  }

  createIssuer(id: string, name: string) {
    this._service.createIssuer(id, name);
  }

  retrieveItem(userID: string, id: string): Promise<Company | undefined> {
    return this._service.findById(userID, id);
  }

  listItems(userId: string): Promise<Company[] | undefined> {
    return this._service.list(userId);
  }
}
