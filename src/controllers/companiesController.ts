import {Company, CompaniesServiceI} from '../core/company';
import {Socket} from 'socket.io';
import {
  SocketController,
  socketListeners,
} from './socketRouter';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';

@injectable()
export class CompaniesController implements SocketController {
  private _service: CompaniesServiceI;
  private _namespace = 'companies';

  constructor(
    @inject(TYPES.CompaniesService) issuersService: CompaniesServiceI,
  ) {
    this._service = issuersService;
  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: string): socketListeners {
    // ':list', async () => {
    //       const list = await this.listItems(userId);
    //       socket.emit(this._namespace + ':updateList', list);
    //     }
    //
    // socket.on(
    //   this._namespace + ':list',
    //   Logger(async () => {
    //     const list = await this.listItems(userId);
    //     socket.emit(this._namespace + ':updateList', list);
    //   }),
    // );
    //
    // socket.on(
    //   this._namespace + ':retrieve',
    //   Logger(
    // );

    return {
      list: async () => {
        const list = await this.listItems(userId);
        socket.emit(this._namespace + ':updateList', list);
      },
      retrieve: async ({id}) => {
        const data = await this.retrieveItem(userId, id);
        socket.emit(this._namespace + ':updateDetails', data);
      },
    };


  }

  createIssuer(id: string, name: string) {
    this._service.createIssuer(id, name);
  }

  retrieveItem(userID: string, id: string): Promise<Company | undefined> {
    return this._service.findById(userID, id);
  }

  async listItems(userId: string): Promise<Company[] | undefined> {
    return this._service.list(userId);
  }
}
