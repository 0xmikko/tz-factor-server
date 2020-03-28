import {Payment, PaymentsRepositoryI} from '../core/payments';
import {injectable} from 'inversify';

@injectable()
export class PaymentsRepository implements PaymentsRepositoryI {
  private _events: Payment[] = [];

  listByUser(userId: string): Payment[] {

    const incomingPayments = this._events
      .filter(e => e.recipient?.company?.id === userId)
      .map(e => ({
        ...e,
        isIncoming: true,
      }));

    const outcomingPayments = this._events
      .filter(e => e.sender?.company?.id === userId)
        .map(e => ({
          ...e,
          isIncoming: false,
        }));

    const allUserPayments = [...incomingPayments, ...outcomingPayments];

    const compareFn = (a: Payment, b: Payment) => {
      if (a.date > b.date) return 1;
      return -1;
    };

    return allUserPayments.sort(compareFn);
  }

  updateEvents(e: Payment[]) {
    this._events = e;
  }
}
