import {Socket} from 'socket.io';
import {SocketController, socketListeners} from './socketRouter';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {Offer, OfferBuyDTO, OfferCreateDTO, OffersServiceI} from "../core/offers";
import {Role} from "../core/company";
import {STATUS} from "../core/operations";

@injectable()
export class OffersController implements SocketController {
  private _service: OffersServiceI;
  private _namespace = 'offers';

  constructor(
    @inject(TYPES.OffersService) issuersService: OffersServiceI,
  ) {
    this._service = issuersService;
  }

  get namespace(): string {
    return this._namespace;
  }

  getListeners(socket: Socket, userId: string, role: Role): socketListeners {
    return {
      list: async () => {
        const list = await this.list();
        socket.emit(this._namespace + ':updateList', list);
      },

      retrieve: async ({id}) => {
        const data = await this.retrieveItem(userId, id);
        socket.emit(this._namespace + ':updateDetails', data);
      },

      create: async (dto: OfferCreateDTO, opHash: string) => {
        console.log(dto)
        try {
          const result = await this._service.create(userId, dto);
          socket.emit('operations:update', {
            id: opHash,
            status: STATUS.SUCCESS,
          });
          socket.emit(this._namespace + ':updateDetails', result);
        }catch (e) {
          socket.emit('operations:update', {
            id: opHash,
            status: STATUS.FAILURE,
            error: e,
          });
        }
      },

      buy: async (dto: OfferBuyDTO, opHash: string) => {
        try {
          const result = await this._service.buy(userId, dto);
          socket.emit('operations:update', {
            id: opHash,
            status: STATUS.SUCCESS,
          });
          socket.emit(this._namespace + ':updateDetails', result);
        } catch (e) {
          socket.emit('operations:update', {
            id: opHash,
            status: STATUS.FAILURE,
            error: e.toString(),
          });
        }
      },


    };
  }

  list(): Promise<Offer[] | undefined> {
    return this._service.list();

  }

  retrieveItem(userID: string, id: string): Promise<Offer | undefined> {
    return this._service.findById(id);
  }


  update(): Promise<void> {
    return new Promise<void>(resolve => {
      resolve();
    });
  }
}
