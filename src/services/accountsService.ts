
import {inject, injectable} from 'inversify';
import {Account, AccountCreateDTO, AccountsRepositoryI, AccountsServiceI} from '../core/accounts';
import {TYPES} from "../types";
import {CompaniesRepositoryI} from "../core/company";

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

  create(userId: string, dto: AccountCreateDTO): Promise<string| undefined>  {
    return new Promise<string|undefined>(async (resolve, reject) => {
      const company = await this._companyRepository.findOne(userId)
      if (company === undefined) { reject('Cant find company for user');
      return;}

      const result = await this._repository.findOne(dto.id)
      if (result) {
        reject('Account is already registered')
        return
      }

      try {
        const result = await this._repository.insert({
          id: dto.id,
          company,
        })
        resolve(result);
        return
      }
      catch (e) {
        reject(e);
      }
    })

  }

  list(userId: string): Promise<Account[] | undefined>  {
    return this._repository.listAccountsWithCompanies()
  }

}
