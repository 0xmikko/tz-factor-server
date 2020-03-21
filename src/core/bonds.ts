import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';
import {Company} from './company';
import {Payment} from './payments';
import {BondShare} from "./shares";

@Entity()
export class Bond {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => Company,
    company => company.bonds,
  )
  issuer: Company;

  @Column()
  amount: number;

  @Column()
  matureDate: Date;

  @OneToMany(
      type => BondShare,
      bondshare => bondshare.bond,
  )
  shares: BondShare[];

  @OneToMany(
    type => Payment,
    payment => payment.bond,
  )
  payments: Payment[];
}

export interface BondCreateDTO {
  amount: number;
  matureDate: number;
  account: string;
}

export const bondCreateDTOSchema = {
  type: 'object',
  required: ['amount', 'matureDate', 'account'],
  properties: {
    amount: {
      type: 'number',
      minimum: 0,
    },
    matureDate: {
      type: 'number',
      minimum: 0,
    },
    account: {
      type: 'string',
      minLength: 5,
    },
  },
};

export interface BondsRepositoryI extends BasicRepositoryI<Bond> {
  retrieve(id: string): Promise<Bond | undefined>;
}

export interface BondsServiceI {
  issueBond(userId: string, agreementId: string): void;

  createBond(
    userId: string,
    bondCreateDTO: BondCreateDTO,
  ): Promise<string | undefined>;
  findById(userId: string, id: string): Promise<Bond | undefined>;
  list(userId: string): Promise<Bond[] | undefined>;
  update(userId: string, data: Bond): void;
  delete(userId: string, id: string): void;
}
