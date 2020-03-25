import fs from 'fs';
import {TezosNodeWriter, TezosWalletUtil} from 'conseiljs';
import {KeyStore} from 'conseiljs/dist/types/wallet/KeyStore';
import key from './faucet.json';
import {tezosNode} from './config';
import fa from './faucet.json';

export async function getKeystoreFromFaucet() {

  const keystore: KeyStore = await TezosWalletUtil.unlockFundraiserIdentity(
    fa.mnemonic.join(' '),
    fa.email,
    fa.password,
    fa.pkh,
  );

  const result1 = await TezosNodeWriter.sendIdentityActivationOperation(
    tezosNode,
    keystore,
    key.secret,
  );
  console.log(
    `IDENTITY: Injected operation group id ${result1.operationGroupID}`,
  );

  const result2 = await TezosNodeWriter.sendKeyRevealOperation(
    tezosNode,
    keystore,
  );
  console.log(
    `REVEAL: Injected operation group id ${result2.operationGroupID}`,
  );

  fs.writeFileSync("./src/keys.json", JSON.stringify(keystore))
  console.log("Key store saved to file keys.json", keystore);
}

getKeystoreFromFaucet().then(r => console.log("Successfully done!"))
