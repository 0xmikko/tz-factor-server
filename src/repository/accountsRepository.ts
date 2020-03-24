import {TypeORMRepository} from './typeORMRepository';
import {injectable} from 'inversify';
import {Account} from "../core/accounts";
import {getManager} from "typeorm";

@injectable()
export class AccountsRepository extends TypeORMRepository<Account>
    implements AccountsRepository {
    constructor() {
        super(Account);
    }

    listAccountsWithCompanies() : Promise<Account[] | undefined>{
        return getManager()
            .getRepository<Account>(Account)
            .find({relations: ['company']});
    }
}
