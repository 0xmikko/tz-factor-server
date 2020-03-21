import {TypeORMRepository} from './typeORMRepository';
import {Payment, PaymentListItem, PaymentsRepositoryI} from '../core/payments';
import {injectable} from 'inversify';
import {getConnection, getManager} from 'typeorm';

@injectable()
export class PaymentsRepository extends TypeORMRepository<Payment>
  implements PaymentsRepositoryI {
  constructor() {
    super(Payment);
  }

  listByUser(userId: string): Promise<PaymentListItem[] | undefined> {
    return getConnection().query(
      `
SELECT p.id as "id",
       p.date as "date",
       p.amount         as "amount",
       p.status as "status",
       companyFrom.name as "fromCompany",
       companyTo.name   as "toCompany",
       issuer.name as "issuer",
       bond."matureDate" as "matureDate"

FROM payment p
INNER JOIN bond bond
    ON bond.id = p."bondId"
INNER JOIN company issuer
    ON bond."issuerId" = issuer.id
INNER JOIN account accFrom
   ON accFrom.id = p."fromId"
INNER JOIN account accTo
   ON accTo.id = p."toId"
INNER JOIN company companyFrom
    ON accFrom."companyId" = companyFrom.id
INNER JOIN company companyTo
    ON accTo."companyId" = companyTo.id
WHERE accFrom."companyId"=$1 OR
      accTo."companyId"=$1`,
      [userId],
    );
  }

  retrieve(id: string): Promise<Payment | undefined> {
    return getManager()
      .getRepository<Payment>(Payment)
      .findOne(id, {relations: ['from', 'to', 'bond']});
  }
}
