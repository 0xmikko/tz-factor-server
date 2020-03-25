import * as fs from 'fs';
import {TezosNodeWriter, TezosParameterFormat} from 'conseiljs';
import keystore from './keys.json';
import {tezosNode} from './config';

const fileName = __dirname + '/contracts/factor.json';

async function DeployFromFile() {
  try {
    if (fs.existsSync(fileName)) {
      const contractCode = fs.readFileSync(fileName).toString();
      console.log(contractCode);

      const storage = '{"storage": "String"}';

      const result3 = await TezosNodeWriter.sendContractOriginationOperation(
        tezosNode,
        keystore,
        0,
        undefined,
        100000,
        '',
        1000,
        100000,
        contractCode,
        storage,
        TezosParameterFormat.Micheline,
      );
      console.log(
        `DEPLOY: Injected operation group id ${result3.operationGroupID}`,
      );
    } else {
      console.log('cant read contract code at', fileName);
    }
  } catch (err) {
    console.log(err);
  }
}

DeployFromFile().then(r => console.log('Done!'));
