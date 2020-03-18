import {Company, CompaniesRepositoryI} from "../core/company";
import {TypeORMRepository} from "./typeORMRepository";
import {injectable} from "inversify";


@injectable()
export class CompaniesRepository extends TypeORMRepository<Company> implements CompaniesRepositoryI{

    constructor() {
        super(Company);
    }



}
