import {BondCreateDTO, bondCreateDTOSchema, BondsServiceI} from '../core/bonds';
import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import Ajv from 'ajv';


@injectable()
export class BondsController implements SocketController {
  private _namespace = 'bonds';
  private _service: BondsServiceI;

  private _validate : Ajv.ValidateFunction

  constructor(@inject(TYPES.BondsService) service: BondsServiceI) {
    this._service = service;

    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    this._validate = ajv.compile(bondCreateDTOSchema);

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

      // RETRIEVE HANDLER
      retrieve: async (id: string) => {
        console.log(id)
        const item = await this._service.findById(userId, id);
        socket.emit(this._namespace + ':updateDetails', item);
      },

      // CREATE CONTROLLER
      create: async (dto: BondCreateDTO) => {
        console.log(dto)

        const valid = this._validate(dto);
        if (!valid) {
          console.log("ERROR", this._validate.errors, 'got', dto);
          return
        }

        const result = await this._service.createBond(userId, dto);

        console.log(result)

        if (result) {
          // TODO: BROADCAST
          const list = await this._service.list(userId);
          socket.emit(this._namespace + ':updateList', list);

          const item = await this._service.findById(userId, result);
          socket.emit(this._namespace + ':updateDetails', item);
        }
      },
    };
  }
}
