import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {BasicRepositoryI} from './basic';
import { Account } from './account';
import {Bond} from "./bonds";

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: 'ISSUER' | 'SUPPLIER' | 'INVESTOR';

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  taxId: string;

  @Column()
  web: string;

  @OneToMany(type=> Bond, bond => bond.issuer)
  bonds: Bond[]

  @OneToMany(type => Account, account=> account.company)
  accounts?: Account[];
}

export interface CompaniesRepositoryI extends BasicRepositoryI<Company> {}

export interface CompaniesServiceI {
  createIssuer(userId: string, name: string): void;
  createSupplier(userId: string, name: string): void;
  findById(userId: string, id: string): Promise<Company | undefined>;
  list(userId: string): Promise<Company[] | undefined>;
  update(userId: string, data: Company): void;
  delete(userId: string, id: string): void;
}
