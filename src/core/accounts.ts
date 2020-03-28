import {Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {BasicRepositoryI} from './basic';
import {Company, Role} from './company';

@Entity()
export class Account {
  @PrimaryColumn()
  id: string;

  @ManyToOne(
    type => Company,
    company => company.accounts,
  )
  company: Company;

  amount?: number;
}

export interface AccountDTO {
  id: string;
  opHash: string;
}

export const accountDTOSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
    },
  },
};

export interface AccountsRepositoryI extends BasicRepositoryI<Account> {
  register(companyType: Role, dto: Account): Promise<Boolean>;
  deposit(id: string): Promise<boolean>;
  getCompanyByAccount(id: string): Promise<Company>;
  listAccountsWithCompanies(): Promise<Account[] | undefined>;
  update(id: string, a: Account): void;
}

export interface AccountsServiceI {
  create(
    userId: string,
    role: Role,
    dto: AccountDTO,
  ): Promise<string | undefined>;
  deposit(id: string): Promise<boolean>;
  list(): Promise<Account[] | undefined>;
  update(): Promise<void>;
}
