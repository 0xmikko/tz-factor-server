import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BasicRepositoryI} from '../core/basic';

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  // @Column()
  // issuer: Company;
  //
  // @Column()
  // supplier: Account;
  //
  // @Column()
  // hash: string;
  //
  // @Column()
  // signedByIssuer: boolean;
  //
  // @Column()
  // signedBySupplier: boolean;
  //
  // // Offered, signed, cancelled, ended
  // @Column()
  // status: string;
}

export interface AgreementRepositoryI extends BasicRepositoryI<Agreement> {}

export interface AgreementsServiceI {
  offerAgreement(userId: string, supplierId: string, hash: string): void;
  signOfferedAgreement(userId: string, agreementId: string) : void

  findById(userId: string, id: string): Promise<Agreement | undefined>;

  listForIssuer(userId: string): Agreement[];
  listForSupplier(userId: string): Agreement[];
}
