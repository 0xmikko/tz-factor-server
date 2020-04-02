import {
  Payment,
  PaymentsServiceI,
  PaymentsRepositoryI,
  PaymentContractEvent,
} from '../core/payments';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {SCManager} from '../repository/smartContractManager';
import {AccountsRepositoryI} from '../core/accounts';
import {BondsRepositoryI} from '../core/bonds';

@injectable()
export class PaymentsService implements PaymentsServiceI {
  private _repository: PaymentsRepositoryI;
  private _accountsRepository: AccountsRepositoryI;
  private _bondsRepository: BondsRepositoryI;

  public constructor(
    @inject(TYPES.PaymentsRepository) repository: PaymentsRepositoryI,
    @inject(TYPES.AccountsRepository) accountsRepository: AccountsRepositoryI,
    @inject(TYPES.BondsRepository) bondsRepository: BondsRepositoryI,
  ) {
    this._repository = repository;
    this._accountsRepository = accountsRepository;
    this._bondsRepository = bondsRepository;
  }

  listByUser(userId: string): Payment[] {
    return this._repository.listByUser(userId);
  }

  update(): Promise<void> {
    return new Promise<void>(async resolve => {
      const events: Payment[] = [];
      const contractEvents = SCManager.getManager().events;

      let count = 0;
      for (const e of contractEvents) {
        const p = await this.updateItem(count.toString(), e);
        console.log('PP=>', p);
        events.push(p);
        count++;
      }

      this._repository.updateEvents(events);
      console.log('EVENTSSS:', contractEvents, events);
      resolve();
    });
  }

  private updateItem(id: string, dto: PaymentContractEvent): Promise<Payment> {
    return new Promise<Payment>(async resolve => {
      const senderAccount = await this._accountsRepository.findOne(dto.sender);
      const recipientAccount = await this._accountsRepository.findOne(
        dto.recepient,
      );

      const bond = !dto.isMoney
        ? this._bondsRepository.retrieve(dto.bondIndex.toNumber())
        : undefined;

      const p: Payment = {
        id,
        date: dto.date,
        sender: senderAccount,
        recipient: recipientAccount,
        amount: dto.value.toNumber(),
        isMoney: dto.isMoney,
        bond: bond,
      };

      resolve(p);
    });
  }
}
