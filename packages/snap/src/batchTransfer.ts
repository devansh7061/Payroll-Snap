import { ethers } from 'ethers';
import { getAbstractAccount } from './getAbstractAccount';
import { getGasFee } from './getGasFee';
import { printOp } from './printOp';
import { getHttpRpcClient } from './getHttpRpcClient';

interface TransactionsInterface {
  id: number;
  address: string;
  amount: string;
}

export const batchTransfer = async (transactionDetails: TransactionsInterface[]) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/',
  );
  const aa = await getAbstractAccount();
  const address = await aa.getAccountAddress();
  const sender = await aa.getCounterFactualAddress();
  const ac = await aa._getAccountContract();
  // const transactionDetails = [{ id: 1, address: "0xa87163423b6d046f325bf2d977f261c4dfea2f62", amount: "0.1" }];
  const result = await wallet.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: 'Transfer',
        description: 'Transfer from your Abstraction Account',
        textAreaContent: `Sending batch transaction from ${address}`,
      },
    ],
  });
  if (!result) {
    return;
  }
  let dest: Array<string> = [];
  let data: Array<string> = [];
  transactionDetails.forEach((transaction) => {
    dest = [...dest, sender];
    const value = ethers.utils.parseEther(transaction.amount);
    data = [
      ...data,
      ac.interface.encodeFunctionData('execute', [
        ethers.utils.getAddress(transaction.address.trim()),
        value,
        '0x',
      ]),
    ];
  });
  const op = await aa.createSignedUserOp({
    target: sender,
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);

  const client = await getHttpRpcClient(
    provider,
    'https://app.stackup.sh/api/v1/bundler/173f31bde6f73754eb1c847dee859eb5833edbdae4b5cb2547e29d73b6385d22',
    '0x0F46c65C17AA6b4102046935F33301f0510B163A',
  );

  const uoHash = await client.sendUserOpToBundler(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await aa.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);
};
