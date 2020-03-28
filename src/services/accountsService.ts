import {inject, injectable} from 'inversify';
import {
  Account,
  AccountDTO,
  AccountsRepositoryI,
  AccountsServiceI,
} from '../core/accounts';
import {TYPES} from '../types';
import {CompaniesRepositoryI, Role} from '../core/company';
import {SCManager} from '../repository/smartContractManager';

@injectable()
export class AccountsService implements AccountsServiceI {
  private _repository: AccountsRepositoryI;
  private _companyRepository: CompaniesRepositoryI;

  public constructor(
    @inject(TYPES.AccountsRepository) repository: AccountsRepositoryI,
    @inject(TYPES.CompaniesRepository) companyRepository: CompaniesRepositoryI,
  ) {
    this._repository = repository;
    this._companyRepository = companyRepository;
  }

  create(
    userId: string,
    role: Role,
    dto: AccountDTO,
  ): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      const company = await this._companyRepository.findOne(userId);
      if (company === undefined) {
        reject('Cant find company for user');
        return;
      }

      const result = await this._repository.findOne(dto.id);
      if (result) {
        reject('Account is already registered');
        return;
      }

      try {
        await this._repository.register(company.type, {
          id: dto.id,
          company,
        });
        resolve(dto.id);

        return;
      } catch (e) {
        reject(e);
      }
    });
  }

  list(): Promise<Account[] | undefined> {
    return this._repository.list();
  }

  update(): Promise<void> {
    return new Promise<void>(async resolve => {
      const accounts = await this._repository.listAccountsWithCompanies();
      const balancesData = SCManager.getManager().balances;

      accounts
        ?.filter(acc => balancesData[acc.id] !== undefined)
        .forEach(acc => {
          acc.amount = balancesData[acc.id];
          this._repository.update(acc.id, acc);
        });
      resolve();
    });
  }


  deposit(id: string): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      const result = await this._repository.deposit(id);

      await SCManager.getManager().updateData();
      await this.update();
      resolve(result);
    });
  }
}
