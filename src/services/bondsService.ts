import {
  Bond,
  BondsServiceI,
  BondsRepositoryI,
  BondContractDTO,
} from '../core/bonds';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {SCManager} from '../repository/smartContractManager';
import {AccountsRepositoryI} from '../core/accounts';

@injectable()
export class BondsService implements BondsServiceI {
  private _repository: BondsRepositoryI;
  private _accountsRepository: AccountsRepositoryI;

  public constructor(
    @inject(TYPES.BondsRepository) repository: BondsRepositoryI,
    @inject(TYPES.AccountsRepository) accountsRepository: AccountsRepositoryI,
  ) {
    this._repository = repository;
    this._accountsRepository = accountsRepository;
  }

  list(): Bond[] {
    return this._repository.list();
  }

  findById(id: number): Bond | undefined {
    console.log("QQQQ", id)
    return this._repository.retrieve(id);
  }

  update(): Promise<void> {
    return new Promise<void>(async resolve => {
      const bondsData = SCManager.getManager().bonds;

      Object.entries(bondsData).forEach( b =>
        this.updateItem(parseInt(b[0]), b[1]),
      );
      resolve();
    });
  }


  async updateItem(id: number, dto: BondContractDTO) {
    const issuer = await this._accountsRepository.getCompanyByAccount(
      dto.issuer,
    );

    const balance: Record<string, number> = {};
    dto.balance.forEach((k, v) => {
      balance[v] = k.toNumber();
    });

    const bond: Bond = {
      id,
      issuerAccount: dto.issuer,
      issuer,
      total: dto.total.toNumber(),
      balance,
      matureDate: new Date(dto.matureDate),
    };

    console.log('update', id, bond);
    this._repository.update(id, bond);
  }
}
