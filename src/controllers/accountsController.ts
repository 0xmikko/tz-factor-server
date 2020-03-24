import {AccountCreateDTO, accountCreateDTOSchema, AccountsServiceI} from '../core/accounts';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import Ajv from 'ajv';
import {TYPES} from "../types";


@injectable()
export class AccountsController implements SocketController {
  private _namespace = 'accounts';
  private _service: AccountsServiceI;

  private _validate : Ajv.ValidateFunction

  constructor(@inject(TYPES.AccountsService) service: AccountsServiceI) {
    this._service = service;

    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    this._validate = ajv.compile(accountCreateDTOSchema);

  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: string): socketListeners {
    return {
      // LIST HANDLER
      list: async () => {
        const list = await this._service.list(userId);
        socket.emit(this._namespace + ':updateList', list);
      },

      // CREATE CONTROLLER
      create: async (dto: AccountCreateDTO) => {
        console.log(dto)

        const valid = this._validate(dto);
        if (!valid) {
          console.log("ERROR", this._validate.errors, 'got', dto);
          return
        }

        try {
          const result = await this._service.create(userId, dto);

          console.log(result)

          if (result) {
            // TODO: BROADCAST
            const list = await this._service.list(userId);
            socket.emit(this._namespace + ':updateList', list);
          }
        }catch (e) {
          console.log("Cant create entry")
        }
      },
    };
  }
}
