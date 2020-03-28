import {TypeORMRepository} from './typeORMRepository';
import {injectable} from 'inversify';
import {Account, AccountsRepositoryI} from '../core/accounts';
import {getManager} from 'typeorm';
import {SCManager} from './smartContractManager';
import {Company, Role} from '../core/company';

@injectable()
export class AccountsRepository extends TypeORMRepository<Account>
  implements AccountsRepositoryI {
  private _accounts: Map<string, Account> = new Map<string, Account>();

  constructor() {
    super(Account);
  }

  // Register new user in smartcontract depending on company type
  register(companyType: Role, dto: Account): Promise<Boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const contractInstance = await SCManager.getManager().contractInstance;

        console.log('Register new Issuer with id: ', dto.id);

        const op =
          companyType === 'ISSUER'
            ? await contractInstance.methods.registerIssuer(dto.id).send()
            : await contractInstance.methods.registerUser(dto.id).send();
        console.log(op);
        await op.confirmation(1);
        await super.insert(dto);
        resolve(true);
      } catch (e) {
        reject('Cant register account' + e.toString());
      }
    });
  }

  getCompanyByAccount(id: string): Promise<Company> {
    return new Promise<Company>(async (resolve, reject) => {
      const acc = await this.findOne(id);
      if (acc) {
        resolve(acc.company);
        return;
      }
      reject('cant find company');
    });
  }

  findOne(id: string) : Promise<Account | undefined> {
    return getManager()
        .getRepository<Account>(Account)
        .findOne(id, {relations: ['company']});
  }

  list(): Promise<Account[] | undefined> {
    return new Promise<Account[] | undefined>(resolve => {
      resolve(Array.from(this._accounts.values()));
    });
  }

  update(id: string, account: Account) {
    this._accounts.set(id, account);
  }

  listAccountsWithCompanies(): Promise<Account[] | undefined> {
    return getManager()
      .getRepository<Account>(Account)
      .find({relations: ['company']});
  }

  deposit(id: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const contractInstance = await SCManager.getManager().contractInstance;

        const depositAmount = 100;
        console.log('Deposit money for: ', id);

        const op1 = await contractInstance.methods
          .issueCoins(depositAmount)
          .send();
        console.log('[OP1]:', op1);
        await op1.confirmation(1);
        console.log("[OP1:] Operation confirmed");

        const op2 = await contractInstance.methods
          .transferMoney(id, depositAmount)
          .send();
        console.log('[OP2]:', op2);
        await op2.confirmation(1);
        console.log("[OP2:] Operation confirmed");
        resolve(true);
      } catch (e) {
        reject('Cant deposit account' + e.toString());
      }
    });
  }
}
