import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {BasicRepositoryI} from './basic';
import {Account} from './accounts';

export type Role = 'ISSUER' | 'SUPPLIER' | 'INVESTOR';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: ''})
  name: string;

  @Column()
  type: Role;

  @Column({default: 'Public'})
  orgType: string;

  @Column({default: ''})
  industry: string;

  @Column({default: '2020'})
  founder: string;

  @Column({default: ''})
  headquaters: string;

  @Column({default: 0})
  numberOfEmployees: number;

  @Column({default: ''})
  product: string;

  @Column({default: ''})
  revenue: string;

  @Column({default: ''})
  website: string;

  @OneToMany(
    type => Account,
    account => account.company,
  )
  accounts?: Account[];
}

export interface UpsertCompanyProfileDTO{
  name: string;
  orgType: string;
  industry: string;
  founder: string;
  headquaters: string;
  numberOfEmployees: number;
  product: string;
  revenue: string;
  website: string;
}



export interface CompaniesRepositoryI extends BasicRepositoryI<Company> {}

export interface CompaniesServiceI {
  createIssuer(userId: string, name: string): void;
  createSupplier(userId: string, name: string): void;
  findById(userId: string, id: string): Promise<Company | undefined>;
  list(userId: string): Promise<Company[] | undefined>;
  update(userId: string, data: UpsertCompanyProfileDTO): void;
}
