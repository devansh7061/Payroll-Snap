import { ethers } from 'ethers';
import { getAbstractAccount } from './getAbstractAccount';
import { getGasFee } from './getGasFee';
import { printOp } from './printOp';

interface Details {
  id: number;
  EmployeeAddress: string;
  EmployeeName: string;
  EmployeeCTC: string;
}

interface AddressBook {
  addressBook: Details[]
}

export function isAddressBook(params: unknown): asserts params is AddressBook {
  if (!(
    params
    && typeof params === 'object'
    && 'addressBook' in params
    && Array.isArray(params.addressBook)
    && params.addressBook.every((k:unknown) => typeof k === 'object')
  )) {
    throw new Error('Invalid Arguments');
  }
}
export const payrollTransfer = async ({addressBook}: AddressBook) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/',
  );
  const aa = await getAbstractAccount();
  const address = await aa.getAccountAddress();
  const sender = await aa.getCounterFactualAddress();
  const ac = await aa._getAccountContract();
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
  addressBook.forEach((transaction) => {
    dest = [...dest, sender];
    const value = ethers.utils.parseEther(transaction.EmployeeCTC);
    data = [
      ...data,
      ac.interface.encodeFunctionData('execute', [
        ethers.utils.getAddress(transaction.EmployeeAddress.trim()),
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
  const printedOp = await printOp(op);
  const body = JSON.stringify({
    op: printedOp,
  })

  const response = await fetch('http://localhost:8060/aa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
  const { uoHash } = await response.json();
  console.log(uoHash);
};
