import {AccountDTO, accountDTOSchema, AccountsServiceI} from '../core/accounts';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import Ajv from 'ajv';
import {TYPES} from '../types';
import {Role} from '../core/company';
import {STATUS} from '../core/operations';
import {SCManager} from '../repository/smartContractManager';

@injectable()
export class AccountsController implements SocketController {
  private _namespace = 'accounts';
  private _service: AccountsServiceI;
  private _validate: Ajv.ValidateFunction;

  constructor(@inject(TYPES.AccountsService) service: AccountsServiceI) {
    this._service = service;

    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    this._validate = ajv.compile(accountDTOSchema);
  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: Role): socketListeners {
    return {
      // LIST HANDLER
      list: async () => {
        const list = await this._service.list();
        socket.emit(this._namespace + ':updateList', list);
      },

      // CREATE CONTROLLER
      create: async (dto: AccountDTO) => {
        console.log(dto);

        const valid = this._validate(dto);
        if (!valid) {
          console.log('ERROR', this._validate.errors, 'got', dto);
          return;
        }

        try {
          const result = await this._service.create(userId, role, dto);
          if (result) {
            socket.emit('operations:update', {
              id: dto.opHash,
              status: STATUS.SUCCESS,
            });
            // TODO: BROADCAST
            await SCManager.getManager().updateData();
            await this.update();
            const list = await this._service.list();
            socket.emit(this._namespace + ':updateList', list);
          }
        } catch (e) {
          console.log('Cant create entry' + e.toString());
          socket.emit('operations:update', {
            id: dto.opHash,
            status: STATUS.FAILURE,
            error: 'Cant create entry' + e.toString(),
          });
        }
      },

      deposit: async (dto: AccountDTO) => {
        console.log(dto);
        try {
          const result = await this._service.deposit(dto.id);
          if (result) {
            // TODO: BROADCAST
            socket.emit('operations:update', {
              id: dto.opHash,
              status: STATUS.SUCCESS,
            });
            await this.update();
            const list = await this._service.list();
            socket.emit(this._namespace + ':updateList', list);
          }
        } catch (e) {
          console.log('Cant deposit money' + e.toString());
          socket.emit('operations:update', {
            id: dto.opHash,
            status: STATUS.FAILURE,
            error: 'Cant deposit money' + e.toString(),
          });
        }
      },
    };
  }

  update(): Promise<void> {
    return this._service.update();
  }
}
