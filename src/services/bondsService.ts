import {
  Bond,
  BondsServiceI,
  BondsRepositoryI,
  BondCreateDTO,
} from '../core/bonds';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {v4 as uuidv4} from 'uuid';
import {getRepository} from 'typeorm';
import {Account} from '../core/account';

@injectable()
export class BondsService implements BondsServiceI {
  private _repository: BondsRepositoryI;

  public constructor(
    @inject(TYPES.BondsRepository) repository: BondsRepositoryI,
  ) {
    this._repository = repository;
  }

  issueBond(userId: string, agreementId: string): void {
    throw new Error('Method not implemented.');
  }
  createBond(userId: string, dto: BondCreateDTO): Promise<string | undefined> {
    return new Promise<string>(async (resolve, reject) => {
      const issuer = await getRepository<Account>(Account).findOne(dto.account,
          {relations: ['company']});

      console.log(issuer)

      if (!issuer) {
        reject("Can't find account");
        return;
      }

      if (issuer?.userId !== userId) {
        reject('Operations with this account forbidden for your id');
        return;
      }

      if (!issuer?.company) {
        reject('No company associacted wuth this accound was found');
        return;
      }

      const bond = await this._repository.insert({
        id: uuidv4(),
        issuer: issuer?.company,
        matureDate: new Date(dto.matureDate),
        amount: dto.amount,
        payments: [],
      });

      console.log(bond);

      resolve(bond);
      return;
    });
  }

  createIssuer(name: string): void {
    console.log(name + 'was creared');
  }

  list(): Promise<Bond[] | undefined> {
    return this._repository.list();
  }

  findById(userId: string, id: string): Promise<Bond | undefined> {
    return this._repository.retrieve(id);
  }

  delete(userId: string, id: string): void {}

  update(userId: string, data: Bond): void {}
}
