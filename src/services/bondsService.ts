import {
  Bond,
  BondsServiceI,
  BondsRepositoryI,
  BondContractDTO,
} from '../core/bonds';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {SCManager} from '../repository/smartContractManager';
import {AccountsRepositoryI} from '../core/accounts';
import {calcInterest, OffersRepositoryI} from "../core/offers";

@injectable()
export class BondsService implements BondsServiceI {
  private _repository: BondsRepositoryI;
  private _accountsRepository: AccountsRepositoryI;
  private _offersRepository: OffersRepositoryI

  public constructor(
    @inject(TYPES.BondsRepository) repository: BondsRepositoryI,
    @inject(TYPES.AccountsRepository) accountsRepository: AccountsRepositoryI,
    @inject(TYPES.OffersRepository) offersRepository: OffersRepositoryI,
  ) {
    this._repository = repository;
    this._accountsRepository = accountsRepository;
    this._offersRepository = offersRepository;
  }

  list(): Bond[] {
    return this._repository.list();
  }

  findById(id: number): Bond | undefined {
    return this._repository.retrieve(id);
  }

  update(): Promise<void> {
    return new Promise<void>(async resolve => {
      const bondsData = SCManager.getManager().bonds;

      try {
        for (const b of Object.entries(bondsData)) {

          await this.updateItem(parseInt(b[0]), b[1]);
        }
      }catch (e) {
        console.log("Error during update bonds")
      }
      resolve();
    });
  }


   updateItem(id: number, dto: BondContractDTO) : Promise<void> {
     return new Promise<void>(async (resolve) => {
       const issuer = await this._accountsRepository.getCompanyByAccount(
           dto.issuer,
       );

       const balance: Record<string, number> = {};
       dto.balance.forEach((k, v) => {
         balance[v] = k.toNumber();
       });

       const offers = await this._offersRepository.listByBond(id);
       const offersWithInterestRate = offers?.map(o => calcInterest(o, new Date(dto.matureDate)));
       let avgInterest: number | undefined;

       // Calculate weighted interest rate
       if (offersWithInterestRate) {
         let totalOffers: number = 0;
         let totalInterest: number = 0;
         for (const o of offersWithInterestRate) {
           if (o.interest) {
             const amountOffered = o.amount - o.sold
             totalOffers += amountOffered
             totalInterest += o.interest * amountOffered
           }
         }
         if (totalOffers > 0) {
           avgInterest = totalInterest / totalOffers;
         }
       }

       const bond: Bond = {
         id,
         issuerAccount: dto.issuer,
         issuer,
         total: dto.total.toNumber(),
         balance,
         matureDate: new Date(dto.matureDate),
         offers: offersWithInterestRate,
         avgInterest
       };

       console.log('update', id, bond);
       this._repository.update(id, bond);
       resolve();

     })
   }
}
