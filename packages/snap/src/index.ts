import { OnRpcRequestHandler } from '@metamask/snap-types';
import { ethers } from 'ethers';
import { getAbstractAccount } from './getAbstractAccount';
import { batchTransfer, isTransactionParams, isAddressBook } from './batchTransfer';
import { payrollTransfer } from './payrollTransfer';

interface Details {
  id: number;
  EmployeeAddress: string;
  EmployeeName: string;
  EmployeeCTC: string;
}

interface AddressBook {
  addressBook: Details[]
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

export const addEmployee = async (name: string, address: string, ctc: string) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    const state: AddressBook = {"addressBook": []}
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }
  isAddressBook(state)
  const oldState: Details[] = state.addressBook
  const employeeId = oldState.length+1
  const newState = [...oldState, {"id":employeeId,"EmployeeName": name, "EmployeeAddress": address, "EmployeeCTC": ctc}]
  const updatedState: AddressBook = { "addressBook": newState }
  console.log(newState);
  await wallet.request({
      method: 'snap_manageState', 
      params: ['update', updatedState], 
    }); 
  return wallet.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: "Employee Added",
        description: "Your employee was added in your address book",
        textAreaContent: `Name: ${name}\n` + `Address: ${address}\n` + `CTC: ${ctc}`
      }
    ]
  })
}

export const showAddressBook = async () => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get']
  })
  if (!state) {
    const state: AddressBook = {"addressBook": []}
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }
  isAddressBook(state);
  const addressBook: Details[] = state.addressBook
  return addressBook;
}

export const clearAddressBook = async () => {
  await wallet.request({
  method: 'snap_manageState',
  params: ['clear'],
});
}
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
    case 'payroll':
      isAddressBook(request.params)
      return await payrollTransfer(request.params);
    case 'addEmployee':
      const { employeeName, employeeAddress, employeeCTC } = request?.params as unknown as {
        [key: string]: string;
      };
      return await addEmployee(employeeName, employeeAddress, employeeCTC);
    case 'hello':
      return await showAddressBook();
    case 'clear':
      return await clearAddressBook();
    default:
      throw new Error('Method not found.');
  }
};
