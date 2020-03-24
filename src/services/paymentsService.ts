import {
  Payment,
  PaymentsServiceI,
  PaymentsRepositoryI,
  PaymentCreateDTO, PaymentListItem,
} from '../core/payments';
import {inject, injectable} from 'inversify';
import {getRepository} from 'typeorm';
import {Account} from '../core/accounts';
import {TYPES} from "../types";
import {Bond} from "../core/bonds";

@injectable()
export class PaymentsService implements PaymentsServiceI {
  private _repository: PaymentsRepositoryI;

  public constructor(
    @inject(TYPES.PaymentsRepository) repository: PaymentsRepositoryI,
  ) {
    this._repository = repository;
  }

  pay(userId: string, dto: PaymentCreateDTO): Promise<string | undefined> {
    return new Promise<string>(async (resolve, reject) => {

      const fromAccount = await getRepository<Account>(Account).findOne(dto.from,
          {relations: ['company']});

      const toAccount = await getRepository<Account>(Account).findOne(dto.to,
          {relations: ['company']});

      const bond = await getRepository<Bond>(Bond).findOne(dto.bond,
          {relations: ['issuer', 'shares'], });

      console.log(fromAccount, toAccount, bond);

      // if (!toCompany) {
      //   reject("Can't find account");
      //   return;
      // }
      //
      // if (toCompany?.userId !== userId) {
      //   reject('Operations with this account forbidden for your id');
      //   return;
      // }
      //
      // if (!toCompany?.company) {
      //   reject('No company associacted wuth this accound was found');
      //   return;
      // }
      //
      // const payment = await this._repository.insert({
      //   id: uuidv4(),
      //   issuer: toCompany?.company,
      //   matureDate: new Date(dto.matureDate),
      //   amount: dto.amount,
      //   payments: [],
      // });
      //
      // console.log(payment);

      resolve("payment");
      return;
    });
  }

  listByUser(userId: string): Promise<PaymentListItem[] | undefined>  {
    return this._repository.listByUser(userId);
  }

  findById(userId: string, id: string): Promise<Payment | undefined> {
    return this._repository.retrieve(id);
  }


}
