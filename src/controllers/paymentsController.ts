import {
  PaymentsServiceI,
} from '../core/payments';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {Role} from '../core/company';

@injectable()
export class PaymentsController implements SocketController {
  private _namespace = 'payments';
  private _service: PaymentsServiceI;

  constructor(@inject(TYPES.PaymentsService) service: PaymentsServiceI) {
    this._service = service;
  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: Role): socketListeners {
    return {
      // LIST HANDLER
      list: async () => {
        const list = await this._service.listByUser(userId);
        console.log(list);
        socket.emit(this._namespace + ':updateList', list);
      },
    };
  }

  update(): Promise<void> {
    return this._service.update()
  }
}
