import contract from './contract.json';
import { Tezos, MichelsonMap } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import {BigNumber} from 'bignumber.js';
import key from './keys.json';
// import {ContractMethod} from "@taquito/taquito/dist/types/contract/contract";

// interface tzFactor {
//   transferMoney: (address: string) => ContractMethod;
//   transferBonds: (address: string) => ContractMethod;
//   registerUser: (address: string) => ContractMethod;
//   registerIssuer:(address: string) => ContractMethod;
//   issueCoins: (address: string) => ContractMethod;
//   issueBond: (address: string) => ContractMethod;
//   executeBond: (address: string) => ContractMethod;
// }


export interface bondContract {
  issuer: string,
  matureDate: string,
  total: BigNumber,
  balance: MichelsonMap<string, BigNumber>

}

export interface ContractStorage {
  owner: string;
  balance: MichelsonMap<string, BigNumber>
  issuers: MichelsonMap<string, boolean>
  bonds: MichelsonMap<number, bondContract>
}



async function getData() {

  // let contractCode: string;
  // try {
  //   contractCode = loadFromFile(contractFileName);
  // } catch (err) {
  //   console.log('Cant get contract/storage', err);
  //   return;
  // }

  try {


    // const result = await TezosContractIntrospector.generateEntryPointsFromCode(contractCode)
    // console.log(result)
    // process.exit(1);
    Tezos.setProvider({
      rpc: "https://carthagenet.tezos.org.ua",
      signer: new InMemorySigner(key.privateKey),

    });
    // fetches contract storage
    const contractInstance = await Tezos.contract.at(contract.address);


    console.log(contractInstance.parameterSchema.ExtractSchema())

    // const op = await contractInstance.methods.issueBond(  new Date().toISOString(), 1000).send()
    // // const op = await contractInstance.methods.issueCoins(100).send()
    // // const op = await contractInstance.methods.transferMoney("tz1g7zf9k7bggE8trwE5wWNY4KvRCut21fJV", 50).send()
    const op = await contractInstance.methods.transferBonds(0, "tz1g7zf9k7bggE8trwE5wWNY4KvRCut21fJV", 50).send()
    console.log(op)

    const storage = await contractInstance.storage<ContractStorage>();


    storage.balance.forEach((k, v) => console.log(v, k.toNumber()))
    storage.bonds.forEach((k, v) => {
      console.log("BOND N", v)
      console.log("ISSSUER", k.issuer)
      console.log("TOTAL", k.total.toNumber())
      console.log("MATURE_DATE", k.matureDate)
      k.balance.forEach((k, v) => console.log(v, k.toNumber()))
    })


  } catch (err) {
    console.log('Cant invoke contract!', err);
  }
}

getData()
  .then(r => console.log('Done!'))
  .catch(e => console.log('Invokation error', e));
