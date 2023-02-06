import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

interface TransactionsInterface {
  id: number,
  address: string,
  amount: string
}

interface TransactionParams {
  transactionalDetails: TransactionsInterface[];
}

interface Details {
  id: number;
  EmployeeAddress: string;
  EmployeeName: string;
  EmployeeCTC: string;
}

interface AddressBook {
  addressBook: Details[]
}

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

export const connectEOA = async (): Promise<string> => {
  const address = (await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'connect_eoa',
      },
    ],
  })) as string;
  return address;
};

export const connectAA = async (): Promise<string> => {
  const address = (await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'connect',
      },
    ],
  })) as string;
  return address;
};

export const batchTransaction = async (transactionalDetails: TransactionParams) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'batchTransfer',
        params: transactionalDetails
      }
    ]
  })
}

export const payrollTransaction = async (addressBook: AddressBook) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'payroll',
        params: addressBook
      }
    ]
  })
}

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
