import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';
import {Account} from '../core/accounts';
import {Bond} from '../core/bonds';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @ManyToOne(
    type => Bond,
    bond => bond.payments,
  )
  bond: Bond;

  @ManyToOne(
    type => Account,
    account => account.paymentsFrom,
    {eager: true},
  )
  from: Account;

  @ManyToOne(
    type => Account,
    account => account.paymentsTo,
    {eager: true},
  )
  to: Account;

  @Column()
  amount: number;

  @Column()
  status: 'SUBMITTED' | 'CONFIRMED';
}

export interface PaymentCreateDTO {
  bond: string
  from: string;
  to: string;
  amount: number;
}

export interface PaymentListItem {
  id: string;
  date: Date;
  amount: number;
  fromCompany: string;
  toCompany: string;
  issuer: string;
  matureDate: Date;
  status: string;
}

export const paymentCreateDTOSchema = {
  type: 'object',
  required: ['from', 'to', 'amount'],
  properties: {
    amount: {
      type: 'number',
      minimum: 0,
    },
    from: {
      type: 'string',
    },
    to: {
      type: 'string',
    },
  },
};


export interface PaymentsRepositoryI extends BasicRepositoryI<Payment> {
  listByUser(userId: string): Promise<PaymentListItem[] | undefined>;
  retrieve(id: string): Promise<Payment | undefined>;
}

export interface PaymentsServiceI {
  pay(userId: string, dto: PaymentCreateDTO): Promise<string | undefined>;
  findById(userId: string, id: string): Promise<Payment | undefined>;
  listByUser(userId: string): Promise<PaymentListItem[] | undefined>;
}
