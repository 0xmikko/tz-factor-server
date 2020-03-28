import {
  Company,
  CompaniesServiceI,
  Role,
  UpsertCompanyProfileDTO,
} from '../core/company';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {STATUS} from '../core/operations';

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

  getListeners(socket: Socket, userId: string, role: Role): socketListeners {
    return {
      list: async () => {
        const list = await this.listItems(userId);
        socket.emit(this._namespace + ':updateList', list);
      },

      retrieve: async ({id}) => {
        const data = await this.retrieveItem(userId, id);
        socket.emit(this._namespace + ':updateDetails', data);
      },

      update: async (dto: UpsertCompanyProfileDTO, opHash: string) => {
        const result = await this._service.update(userId, dto);
        console.log(result);

        const list = await this.listItems(userId);
        socket.emit(this._namespace + ':updateDetails', result);
        socket.emit('operations:update', {
          id: opHash,
          status: STATUS.SUCCESS,
        });
        socket.emit(this._namespace + ':updateList', list);
      },
    };
  }

  retrieveItem(userID: string, id: string): Promise<Company | undefined> {
    return this._service.findById(userID, id);
  }

  listItems(userId: string): Promise<Company[] | undefined> {
    return this._service.list(userId);
  }

  createIssuer(id: string, name: string) {
    this._service.createIssuer(id, name);
  }

  update(): Promise<void> {
    return new Promise<void>(resolve => {
      resolve();
    });
  }
}
