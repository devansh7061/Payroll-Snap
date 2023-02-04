import { OnRpcRequestHandler } from '@metamask/snap-types';
import { ethers } from 'ethers';
import { getAbstractAccount } from './getAbstractAccount';
import { batchTransfer, isTransactionParams } from './batchTransfer';

interface TransactionsInterface {
  id: number;
  address: string;
  amount: string;
}

export const changeNetwork = async () => {
  await wallet.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x13881' }],
  });
};

export const getEoaAddress = async (): Promise<string> => {
  const provider = new ethers.providers.Web3Provider(wallet as any);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
};

export const getAddress = async (): Promise<string> => {
  const aa = await getAbstractAccount();
  const address = await aa.getAccountAddress();
  return address;
};
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  await changeNetwork();
  switch (request.method) {
    case 'connect_eoa':
      return await getEoaAddress();
    case 'connect':
      return await getAddress();
    case 'batchTransfer':
      isTransactionParams(request.params)
      return await batchTransfer(request.params);
    default:
      throw new Error('Method not found.');
  }
};
