import {Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {BasicRepositoryI} from './basic';
import { Company } from './company';
import {Payment} from "./payments";

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Company, company => company.accounts)
  company: Company;

  @OneToMany(type=>Payment, payment => payment.from)
  paymentsFrom: Payment[];

  @OneToMany(type=>Payment, payment => payment.to)
  paymentsTo: Payment[];

}

export interface AccountsRepositoryI extends BasicRepositoryI<Account> {
  listAccountsWithCompanies() : Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  createSupplier(userId: string, name: string): void;
  findById(userId: string, id: string): Promise<Account | undefined>;
  list(userId: string): Account[];
  update(userId: string, data: Account): void;
  delete(userId: string, id: string): void;
}
