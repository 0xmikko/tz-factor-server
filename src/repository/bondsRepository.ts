import {TypeORMRepository} from './typeORMRepository';
import {Bond, BondsRepositoryI} from '../core/bonds';
import {injectable} from 'inversify';
import {getManager} from 'typeorm';

@injectable()
export class BondsRepository extends TypeORMRepository<Bond>
  implements BondsRepositoryI {
  constructor() {
    super(Bond);
  }

  list(): Promise<Bond[] | undefined> {
    return getManager()
      .getRepository<Bond>(Bond)
      .find({relations: ['issuer']});
  }

  retrieve(id: string): Promise<Bond | undefined> {
    return getManager()
        .getRepository<Bond>(Bond)
        .findOne(id, {relations: ['issuer']});
  }




}
