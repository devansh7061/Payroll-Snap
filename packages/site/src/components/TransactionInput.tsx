import React from 'react';
import styled from 'styled-components';

const AddressInput = styled.input`
  margin-top: 10px;
  font-size: 18px;
  width: 100%;
`;

const AmountInput = styled.input`
  margin-top: 10px;
  font-size: 18px;
  width: 100%;
`;

interface TransactionsInterface {
  id: number,
  address: string,
  amount: string
}

interface transactionInputProps {
    transaction: TransactionsInterface;
    handleAddressChange: (transactionDetails: TransactionsInterface, event: React.ChangeEvent<HTMLInputElement>) => void
    handleAmountChange: (transactionDetails: TransactionsInterface, event: React.ChangeEvent<HTMLInputElement>) => void
}
export const TransactionInput = (props: transactionInputProps) => {
    // const [transaction, setTransaction] = useState<transactionInputProps>({address:props.address, amount:props.amount});
    // const handleAddressChange = (event: React.FocusEvent<HTMLInputElement>) => {
    //     setTransaction({ ...transaction, address:event.currentTarget.value })
    // }
    // const handleAmountChange = (event: React.FocusEvent<HTMLInputElement>) => {
    //     setTransaction({ ...transaction, amount:event.currentTarget.value })
    // }
    return (
        <>
            <AddressInput type="text" placeholder='Address' onChange={(e) =>props.handleAddressChange(props.transaction,e)} value={ props.transaction.address} />
            <AmountInput type="text" placeholder='Amount' onChange={(e) => props.handleAmountChange(props.transaction,e)} value={props.transaction.amount} />
        </>
    )
}