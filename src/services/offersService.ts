import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {
  Offer,
  OfferBuyDTO,
  OfferCreateDTO,
  OffersRepositoryI,
  OffersServiceI,
  SellBondsContractDTO,
} from '../core/offers';
import {AccountsRepositoryI} from '../core/accounts';
import {BondsRepositoryI} from '../core/bonds';

@injectable()
export class OffersService implements OffersServiceI {
  private _repository: OffersRepositoryI;
  private _accountRepository: AccountsRepositoryI;
  private _bondsRepository: BondsRepositoryI;

  public constructor(
    @inject(TYPES.OffersRepository) repository: OffersRepositoryI,
    @inject(TYPES.BondsRepository) bondsRepository: BondsRepositoryI,
    @inject(TYPES.AccountsRepository) accountsRepository: AccountsRepositoryI,
  ) {
    this._repository = repository;
    this._bondsRepository = bondsRepository;
    this._accountRepository = accountsRepository;
  }

  create(userId: string, dto: OfferCreateDTO): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      // is user has ths account?
      const company = await this._accountRepository.getCompanyByAccount(
        dto.account,
      );
      if (userId !== company.id) {
        reject("You cant create offer from account you've not register");
        return;
      }

      // is bond exists with this id?
      const bond = await this._bondsRepository.retrieve(dto.bondId);
      if (!bond) {
        reject('Cant find bond with this bondId' + dto.bondId.toString());
        return;
      }

      // is user has enough bonds to sell
      const sellerBalance = bond.balance[dto.account];
      if (!sellerBalance || sellerBalance < dto.amount) {
        reject("You haven't enough bonds " + sellerBalance);
        return;
      }

      // TODO: Check another offers

      const newOffer: Offer = {
        status: 'New',
        bondId: dto.bondId,
        account: dto.account,
        amount: dto.amount,
        sold: 0,
        price: dto.price,
      };
      const result = this._repository.insert(newOffer);
      resolve(result);
    });
  }

  buy(userId: string, dto: OfferBuyDTO): Promise<Offer | undefined> {
    return new Promise<Offer | undefined>(async (resolve, reject) => {
      try {
        // is user has ths account?
        const company = await this._accountRepository.getCompanyByAccount(
          dto.account,
        );
        if (userId !== company.id) {
          reject("You cant create offer from account you've not register");
          return;
        }

        // Check that offer exists
        const offer = await this._repository.findOne(dto.offerId);
        if (!offer) {
          reject('Cant find an offer with this id');
          return;
        }

        const contractDTO: SellBondsContractDTO = {
          bondIndex: offer.bondId,
          buyer: dto.account,
          seller: offer.account,
          valueBonds: dto.amount,
          valueMoney: Math.floor((dto.amount * offer.price) / 100),
        };
        // Interact with smart contract
        await this._repository.buy(contractDTO);

        // Update offer on db
        offer.sold += dto.amount;
        if (offer.sold === offer.amount) {
          offer.status = 'Done';
        }
        const result = await this._repository.upsert(offer);
        resolve(result);

      } catch (e) {
        console.log(e)
        reject('Cant buy bonds' + e.toString());
      }
    });
  }

  cancel(userId: string, id: string): Promise<Offer | undefined> {
    return new Promise<Offer | undefined>(async (resolve, reject) => {
      const offer = await this._repository.findOne(id);
      if (!offer) {
        reject('Cant find an offer with this id');
        return;
      }
      offer.status = 'Cancelled';
      const result = this._repository.upsert(offer);
      resolve(result);
    });
  }

  findById(id: string): Promise<Offer | undefined> {
    return this._repository.findOne(id);
  }

  list(): Promise<Offer[] | undefined> {
    return this._repository.list();
  }

  update(): void {}
}
