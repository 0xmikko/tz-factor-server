import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';
import {Company} from "./company";
import {Payment} from "./payments";

@Entity()
export class Bond {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Company, company => company.bonds)
  issuer: Company;

  @Column()
  amount: number;

  @Column()
  dateOfPayment: Date;

  @OneToMany(type => Payment, payment => payment.bond)
  payments: Payment[];


}

export interface BondsRepositoryI extends BasicRepositoryI<Bond> {}

export interface BondsServiceI {
  issueBond(userId: string, agreementId: string): void;

  createBond(userId: string, name: string): void;
  findById(userId: string, id: string): Promise<Bond | undefined>;
  list(userId: string): Promise<Bond[] | undefined>;
  update(userId: string, data: Bond): void;
  delete(userId: string, id: string): void;
}
