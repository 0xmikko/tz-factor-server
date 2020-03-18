import {Bond, BondsServiceI, BondsRepositoryI} from '../core/bonds';

export class BondsService implements BondsServiceI {

    constructor(private _repository: BondsRepositoryI) {
    }
    issueBond(userId: string, agreementId: string): void {
        throw new Error("Method not implemented.");
    }
    createBond(userId: string, name: string): void {
        throw new Error("Method not implemented.");
    }

    createIssuer(name: string): void {
        console.log(name + "was creared")
    }

    list(): Promise<Bond[] | undefined> {
        return this._repository.list();
    }

    findById(id: string): Promise<Bond | undefined> {
        return this._repository.findOne(id)

    }

    delete(userId: string, id: string): void {
    }

    update(userId: string, data: Bond): void {
    }



}
