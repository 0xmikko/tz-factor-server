import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BasicRepositoryI} from './basic';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({default: 'New'})
  status: 'New' | 'Partial' | 'Done' | 'Cancelled';

  @Column({default: 0})
  bondId: number;

  @Column({default: ''})
  account: string;

  @Column({default: 0})
  amount: number;

  @Column({default: 0})
  sold: number;

  @Column({default: 0})
  price: number;

  interest?: number;
}

export interface OfferCreateDTO {
  bondId: number;
  account: string;
  amount: number;
  price: number;
}

export interface OfferBuyDTO {
  offerId: string;
  account: string;
  amount: number;
}

export interface SellBondsContractDTO {
  bondIndex: number,
  buyer: string,
  seller: string,
  valueBonds: number,
  valueMoney: number,
}

export interface OffersRepositoryI extends BasicRepositoryI<Offer> {
  listByBond(bondId: number): Promise<Offer[] | undefined>;
  buy(dto: SellBondsContractDTO) : Promise<void>;
  update(OfferIndex: number, b: Offer): void;
}

export interface OffersServiceI {
  findById(id: string): Promise<Offer | undefined>;
  create(userId: string, dto: OfferCreateDTO): Promise<string | undefined>;
  buy(id: string, dto: OfferBuyDTO): Promise<Offer | undefined>;
  cancel(userId: string, id: string): Promise<Offer | undefined>;
  list(): Promise<Offer[] | undefined>;
  update(): void;
}

export function calcInterest(offer: Offer, matureDate: Date) : Offer {
  const period =
      (matureDate.valueOf() - Date.now()) / (1000 * 3600 * 24 * 365);
  offer.interest =  (100 - offer.price) / period;
  return offer
}
