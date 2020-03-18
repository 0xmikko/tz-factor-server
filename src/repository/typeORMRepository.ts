import {getManager, ObjectType} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';
import {injectable, unmanaged} from "inversify";

@injectable()
export class TypeORMRepository<T> implements BasicRepositoryI<T> {
  private _entityClass: ObjectType<T>;

  constructor(@unmanaged() table: ObjectType<T>) {
    this._entityClass = table;
  }

  findOne(id: string): Promise<T | undefined> {
    return getManager()
      .getRepository<T>(this._entityClass)
      .findOne(id);
  }

  list(): Promise<T[] | undefined> {
    return getManager()
      .getRepository<T>(this._entityClass)
      .find();
  }

  insert(item: T): Promise<number> {
    return getManager()
      .getRepository<T>(this._entityClass)
      .insert(item)
      .then(r => r.identifiers.length);
  }

  // update(item : T, id: string) {
  //     return getManager().getRepository<T>(this.tableName).update(item, )
  // }
}
