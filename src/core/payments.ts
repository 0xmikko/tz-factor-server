import {BigNumber} from "bignumber.js";
import {Account} from "./accounts";
import {Bond} from "./bonds";

export interface Payment {
  id: string;
  date: Date;
  sender?: Account;
  recipient?: Account;
  amount: number;
  isMoney: boolean;
  isIncoming?: boolean;
  bond? : Bond;
}

export interface PaymentContractEvent {
  date: Date;
  sender: string;
  recepient: string;
  value: BigNumber;
  isMoney: boolean;
  bondIndex: BigNumber;
}


export interface PaymentsRepositoryI {
  listByUser(userId: string): Payment[];
  updateEvents(e: Payment[]) : void;

}

export interface PaymentsServiceI {
  listByUser(userId: string): Payment[];
  update(): Promise<void>;
}
