import * as fs from 'fs';
import {
  TezosConseilClient,
  TezosNodeWriter,
  TezosParameterFormat,
} from 'conseiljs';
import keystore from './keys.json';
import {conseilServer, tezosNode} from './config';

const contractFileName = __dirname + '/contracts/factor.json';
const storageFileName = __dirname + '/contracts/storage.json';

export function loadFromFile(fileName: string): string {
  if (fs.existsSync(fileName)) {
    return fs.readFileSync(fileName).toString();
  } else {
    throw new Error('Cant find file ' + fileName);
  }
}

async function DeployFromFile() {
  let contractCode: string;
  let storage: string;
  try {
    contractCode = loadFromFile(contractFileName);
    storage = loadFromFile(storageFileName);
  } catch (err) {
    console.log('Cant get contract/storage', err);
    return;
  }

  try {
    const nodeResult = await TezosNodeWriter.sendContractOriginationOperation(
      tezosNode,
      keystore,
      0,
      undefined,
      1000000,
      '',
      10000,
      1000000,
      contractCode,
      storage,
      TezosParameterFormat.Micheline,
    );
    console.log(`DEPLOY: Injected operation group id`);
    console.log(nodeResult);
    console.log(nodeResult.results);

    const groupid = nodeResult['operationGroupID']
      .replace(/\"/g, '')
      .replace(/\n/, ''); // clean up RPC output
    console.log(`Injected operation group id ${groupid}`);
    const conseilResult = await TezosConseilClient.awaitOperationConfirmation(
      conseilServer,
      'carthagenet',
      groupid,
      5,
    );
    console.log(
      `Originated contract at https://carthagenet.tzstats.com/${conseilResult[0].originated_contracts}`,
    );


    fs.writeFileSync("./src/contract.json", JSON.stringify({
      address: conseilResult[0].originated_contracts,
    }))

  } catch (err) {
    console.log('Cant deploy contract!', err);
  }
}

DeployFromFile()
  .then(r => console.log('Done!'))
  .catch(e => console.log('Deployment error', e));
