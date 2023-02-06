import styled from 'styled-components';
import React, { useState, useContext } from 'react';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectAA, connectEOA, batchTransaction } from '../utils';
import { TransactionInput } from './TransactionInput';

const CardWrapper = styled.div<{ fullWidth?: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '250px')};
  background-color: ${({ theme }) => theme.colors.card.default};
  margin-top: 12px;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  filter: opacity(${({ disabled }) => (disabled ? '.4' : '1')});
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Center = styled.div`
  text-align: center;
`;

const Text = styled.div`
  margin-bottom: 1.2rem;
`;

const Button = styled.button`
  align-items: center;
  justify-content: center;
  margin-top: auto;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

const Title = styled.h2`
  margin-top: 0px;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

interface TransactionsInterface {
  id: number,
  address: string,
  amount: string
}

interface TransactionParams {
  transactionalDetails: TransactionsInterface[];
}

const TransactionsData: TransactionsInterface[] = [{ id: 1, address: "", amount: "" }]
export const SmartContractWallet = () => {
  const [eoaAddress, setEOAAddress] = useState('');
  const [address, setAddress] = useState('');
  const [, dispatch] = useContext(MetaMaskContext);
  const [transactionDetails, setTransactionDetails] = useState<TransactionsInterface[]>(TransactionsData);
  const handleAddressChange = (transaction: TransactionsInterface, event: React.ChangeEvent<HTMLInputElement>) => {
        const ltransaction = [...transactionDetails]
        const index = transactionDetails.indexOf(transaction)
        ltransaction[index].address=event.currentTarget.value;
        setTransactionDetails(ltransaction);
    }
  const handleAmountChange = (transaction: TransactionsInterface, event: React.ChangeEvent<HTMLInputElement>) => {
        const ltransaction = [...transactionDetails]
        const index = transactionDetails.indexOf(transaction)
        ltransaction[index].amount=event.currentTarget.value;
        setTransactionDetails(ltransaction);
  }
  const handleAddTransaction = () => {
    const id = transactionDetails.length+1
    const ltransaction = [...transactionDetails, { id: id, address: "", amount: "" }];
    setTransactionDetails(ltransaction);
    console.log(transactionDetails);
    transactionDetails.map((transaction) => {
      console.log(transaction.id);
    })
  }

  const handleTransaction = async () => {
    try {
      const TransactionParams: TransactionParams= {transactionalDetails: transactionDetails}
      await batchTransaction(TransactionParams);
      alert('tx has been sent!');
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }
  const handleConnectAAClick = async () => {
    try {
      setEOAAddress(await connectEOA());
      setAddress(await connectAA());
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  
  return (
    <>
      {!address && (
        <CardWrapper fullWidth={true} disabled={false}>
          <Center>
            <Button onClick={handleConnectAAClick}>
              Create Abstract Account
            </Button>
          </Center>
        </CardWrapper>
      )}
      {address && (
        <>
          <CardWrapper fullWidth={true} disabled={false}>
            <Title>Your EOA Account </Title>
            <Text>Address: {eoaAddress}</Text>
          </CardWrapper>
          <CardWrapper fullWidth={true} disabled={false}>
            <Title>Your Abstract Account</Title>
            <Text>Address: {address}</Text>
          </CardWrapper>
          <CardWrapper fullWidth={true} disabled={false}>
            <Title>Send Batch Transaction in Single Click</Title>
            {transactionDetails.map((transaction) => (<TransactionInput key={transaction.id} transaction={transaction} handleAddressChange={handleAddressChange} handleAmountChange={handleAmountChange} />))}
            <br></br>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
            <br></br>
            <Button onClick={handleTransaction}>Send Transaction</Button>
          </CardWrapper>
        </>
      )}
    </>
  );
};
