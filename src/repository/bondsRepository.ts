import {Company, CompaniesRepositoryI} from "../core/company";
import {TypeORMRepository} from "./typeORMRepository";
import {Bond} from "../core/bonds";


export class IssuerRepository extends TypeORMRepository<Company> implements CompaniesRepositoryI{

    constructor() {
        super(Bond);
    }

}
