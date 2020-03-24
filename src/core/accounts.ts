import {Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import {BasicRepositoryI} from './basic';
import { Company } from './company';
import {Payment} from "./payments";

@Entity()
export class Account {
  @PrimaryColumn()
  id: string;

  @ManyToOne(type => Company, company => company.accounts)
  company: Company;

  @OneToMany(type=>Payment, payment => payment.from)
  paymentsFrom?: Payment[];

  @OneToMany(type=>Payment, payment => payment.to)
  paymentsTo?: Payment[];

}

export interface AccountCreateDTO {
  id: string
}

export const accountCreateDTOSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
    },
  },
};


export interface AccountsRepositoryI extends BasicRepositoryI<Account> {
  listAccountsWithCompanies() : Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  create(userId: string, dto: AccountCreateDTO): Promise<string| undefined>
  list(userId: string): Promise<Account[] | undefined>
};
