import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';
import {Account} from '../core/account';
import { Bond } from '../core/bonds';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @ManyToOne(type => Bond, bond => bond.payments)
  bond: Bond;

  @OneToMany(type=>Account, account => account.paymentsFrom)
  from: Account;

  @OneToMany(type=>Account, account => account.paymentsTo)
  to: Account;

  @Column()
  amount: number;

  @Column()
  status: 'SUBMITTED' | 'CONFIRMED';



}

export interface PaymentsRepositoryI extends BasicRepositoryI<Payment> {}

export interface PaymentsServiceI {
  issuePayment(userId: string, agreementId: string): void;

  createPayment(userId: string, name: string): void;
  findById(userId: string, id: string): Promise<Payment | undefined>;
  list(userId: string): Payment[];
  update(userId: string, data: Payment): void;
  delete(userId: string, id: string): void;
}
