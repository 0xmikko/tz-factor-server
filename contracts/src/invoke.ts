import {
  TezosConseilClient,
  TezosNodeWriter,
  TezosParameterFormat,
} from 'conseiljs';
import keystore from './keys.json';
import contract from './contract.json';
import {conseilServer, tezosNode} from './config';
// import {loadFromFile} from "./deploy";


// const contractFileName = __dirname + '/contracts/factor.tz';

async function InvokeContract() {

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

    const nodeResult = await TezosNodeWriter.sendContractInvocationOperation(
      tezosNode,
      keystore,
      contract.address,
      0,
      1000000,
      '',
      10000,
      1000000,
      'registerUser',
      `{ "string": "tz1g7zf9k7bggE8trwE5wWNY4KvRCut21fJV" }`,
      TezosParameterFormat.Micheline,
    );
    console.log(`1:' Injected operation group id ${nodeResult.operationGroupID}`);
    console.log('1:', nodeResult);
    console.log('1:', nodeResult.results);

    const groupid = nodeResult['operationGroupID']
      .replace(/\"/g, '')
      .replace(/\n/, ''); // clean up RPC output

    console.log(`1: Injected operation group id ${groupid}`);

    const conseilResult = await TezosConseilClient.awaitOperationConfirmation(
      conseilServer,
      'carthagenet',
      groupid,
      5,
    );
    console.log('2: Results', conseilResult);

  } catch (err) {
    console.log('Cant invoke contract!', err);
  }
}

InvokeContract()
  .then(r => console.log('Done!'))
  .catch(e => console.log('Invokation error', e));
