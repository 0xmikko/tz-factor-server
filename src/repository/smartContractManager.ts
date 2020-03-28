import {InMemorySigner} from '@taquito/signer';
import {Tezos, MichelsonMap} from '@taquito/taquito';
import config from '../config/config';
import {Contract} from '@taquito/taquito/dist/types/contract/contract';
import {BondContractDTO} from '../core/bonds';
import {BigNumber} from 'bignumber.js';
import {PaymentContractEvent} from "../core/payments";

export interface ContractStorage {
  owner: string;
  balance: MichelsonMap<string, BigNumber>;
  issuers: MichelsonMap<string, boolean>;
  bonds: MichelsonMap<number, BondContractDTO>;
  events: PaymentContractEvent[];
}

export class SCManager {
  private static instance: SCManager;
  private _contractInstance: Contract;
  private _balances: Record<string, number> = {};
  private _bonds: Record<number, BondContractDTO> = {};
  private _events: PaymentContractEvent[] = [];

  get contractInstance(): Promise<Contract> {
    return new Promise<Contract>(async resolve => {
      if (!this._contractInstance) {
        this._contractInstance = await Tezos.contract.at(
          config.contract_address,
        );
      }
      resolve(this._contractInstance);
    });
  }

  get bonds(): Record<number, BondContractDTO> {
    return this._bonds;
  }

  get balances(): Record<string, number> {
    return this._balances;
  }

  get events(): PaymentContractEvent[] {
    return this._events;
  }

  public static getManager(): SCManager {
    if (!SCManager.instance) {
      SCManager.instance = new SCManager();
    }
    return SCManager.instance;
  }

  public updateData(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const ci = await this.contractInstance;
      const storage = await ci.storage<ContractStorage>();
      storage.balance.forEach((k, v) => this._updateBalance(v, k.toNumber()));
      storage.bonds.forEach((k, v) => this._updateBonds(v, k));
      this._events = storage.events;
      console.log('UPDATED', storage);
      console.log(this._bonds);
      console.log(this._balances);
      console.log(this._events);
      resolve();
    });
  }

  private constructor() {
    Tezos.setProvider({
      rpc: config.tezos_node,
      signer: new InMemorySigner(config.private_key),
    });

  }

  private _updateBalance(accountId: string, value: number) {
    this._balances[accountId] = value;
  }

  private _updateBonds(bondId: number, dto: BondContractDTO) {
    this._bonds[bondId] = dto;
  }
}
