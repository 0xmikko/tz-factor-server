import {PaymentCreateDTO, paymentCreateDTOSchema, PaymentsServiceI} from '../core/payments';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import Ajv from 'ajv';
import {TYPES} from "../types";


@injectable()
export class PaymentsController implements SocketController {
  private _namespace = 'payments';
  private _service: PaymentsServiceI;

  private _validate : Ajv.ValidateFunction

  constructor(@inject(TYPES.PaymentsService) service: PaymentsServiceI) {
    this._service = service;

    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    this._validate = ajv.compile(paymentCreateDTOSchema);

  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: string): socketListeners {
    return {
      // LIST HANDLER
      list: async () => {
        const list = await this._service.listByUser(userId);
        console.log(list);
        socket.emit(this._namespace + ':updateList', list);
      },

      // RETRIEVE HANDLER
      retrieve: async (id: string) => {
        console.log(id)
          try {
              const item = await this._service.findById(userId, id);
              socket.emit(this._namespace + ':updateDetails', item);
          }
          catch (e) {
              console.log('Cant find payemnt with id', id, e);
          }
      },

      // CREATE CONTROLLER
     pay: async (dto: PaymentCreateDTO) => {
        console.log(dto)

        const valid = this._validate(dto);
        if (!valid) {
          console.log("ERROR", this._validate.errors, 'got', dto);
          return
        }

        const result = await this._service.pay(userId, dto);

        console.log(result)

        if (result) {
          // TODO: BROADCAST
          const list = await this._service.listByUser(userId);
          socket.emit(this._namespace + ':updateList', list);

          const item = await this._service.findById(userId, result);
          socket.emit(this._namespace + ':updateDetails', item);
        }
      },

    };
  }
}
