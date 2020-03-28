import {Bond, BondsRepositoryI} from '../core/bonds';
import {injectable} from 'inversify';

@injectable()
export class BondsRepository implements BondsRepositoryI {
  private _bonds: Map<number, Bond> = new Map<number, Bond>();

  list(): Bond[] {
    return Array.from(this._bonds.values());
  }

  retrieve(id: number): Bond | undefined {
    return this._bonds.get(id);
  }

  update(bondIndex: number, b: Bond) {
    this._bonds.set(bondIndex, b);
  }
}
