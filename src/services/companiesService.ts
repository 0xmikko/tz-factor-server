import {Company, CompaniesRepositoryI, CompaniesServiceI} from "../core/company";
import {inject, injectable} from "inversify";
import {TYPES} from '../types';

@injectable()
export class CompaniesService implements CompaniesServiceI {

    private _repository: CompaniesRepositoryI

    public constructor(
        @inject(TYPES.CompaniesRepository) repository: CompaniesRepositoryI
    ) {
        this._repository = repository;
    }
    createSupplier(userId: string, name: string): void {
        throw new Error("Method not implemented.");
    }

    createIssuer(name: string): void {
        console.log(name + "was creared")
    }

    list(): Promise<Company[] | undefined> {
        return this._repository.list()
    }

    findById(userId: string, id: string): Promise<Company | undefined> {
        return this._repository.findOne(id)

    }

    delete(userId: string, id: string): void {
    }

    update(userId: string, data: Company): void {
    }



}
