import {TypeORMRepository} from './typeORMRepository';
import {injectable} from 'inversify';
import {Offer, OffersRepositoryI, SellBondsContractDTO} from '../core/offers';
import {getManager} from 'typeorm';
import {SCManager} from './smartContractManager';

@injectable()
export class OffersRepository extends TypeORMRepository<Offer>
  implements OffersRepositoryI {
  constructor() {
    super(Offer);
  }

  buy(dto: SellBondsContractDTO): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {

        console.log("BUYDTO", dto)
        const contractInstance = await SCManager.getManager().contractInstance;

        const op1 = await contractInstance.methods
          .sellBonds(
            dto.bondIndex,
            dto.buyer,
            dto.seller,
            dto.valueBonds,
            dto.valueMoney,
          )
          .send();
        console.log('[OP1]:', op1);
        await op1.confirmation(1);
        console.log('[OP1:] Operation confirmed');

        resolve();
      } catch (e) {
        console.log(e)
        reject(e);
      }
    });
  }

  listByBond(bondId: number): Promise<Offer[] | undefined> {
    return getManager()
      .getRepository<Offer>(Offer)
      .createQueryBuilder('offer')
      .where('offer.bondId=:bondId', {bondId})
      .getMany();
  }

  update(OfferIndex: number, b: Offer): void {}
}
