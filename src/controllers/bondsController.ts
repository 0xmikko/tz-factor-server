import { BondsServiceI} from '../core/bonds';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import {TYPES} from "../types";
import {Role} from "../core/company";
import {SCManager} from "../repository/smartContractManager";


@injectable()
export class BondsController implements SocketController {
  private _namespace = 'bonds';
  private _service: BondsServiceI;

  constructor(@inject(TYPES.BondsService) service: BondsServiceI) {
    this._service = service;
  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: Role): socketListeners {

    return {
      // LIST HANDLER
      list: async () => {
        const list = await this._service.list(userId);
        console.log(list);
        socket.emit(this._namespace + ':updateList', list);
        SCManager.getManager().updateData();
        await this.update();
        socket.emit(this._namespace + ':updateList', list);
      },

      // RETRIEVE HANDLER
      retrieve: async ({id}) => {
        const item = await this._service.findById(parseInt(id));
        socket.emit(this._namespace + ':updateDetails', item);
      },

    };
  }

  update(): Promise<void> {
    return new Promise<void>(resolve => {
      this._service.update();
      resolve();
    });
  }
}
