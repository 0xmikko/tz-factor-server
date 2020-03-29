import {MichelsonMap} from "@taquito/taquito";
import {BigNumber} from 'bignumber.js';
import {Company} from './company';
import {Offer} from "./offers";

export class Bond {
  id: number;
  issuerAccount: string;
  issuer: Company;
  total: number;
  matureDate: Date;
  balance: Record<string, number>;
  avgInterest?: number;
  offers?: Offer[];
}

export interface BondContractDTO {
  issuer: string,
  matureDate: string,
  total: BigNumber,
  balance: MichelsonMap<string, BigNumber>
}

export interface BondsRepositoryI {
  retrieve(id: number): Bond | undefined
  list(): Bond[];
  update(bondIndex: number, b: Bond)  : void;
}

export interface BondsServiceI {
  findById(id: number): Bond | undefined;
  list(userId: string): Bond[] ;
  update() : void;
}
