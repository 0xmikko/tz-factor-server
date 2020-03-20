import {getManager, ObjectType} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';
import {injectable, unmanaged} from 'inversify';

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

  insert(item: T): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      const result = await getManager()
        .getRepository<T>(this._entityClass)
        .insert(item);

      if (result.identifiers.length === 0) {
        reject('Cant insert item');
        return
      }

      const id = result.identifiers[0].id as string;
      resolve(id);
    });
  }

  // update(item : T, id: string) {
  //     return getManager().getRepository<T>(this.tableName).update(item, )
  // }
}
