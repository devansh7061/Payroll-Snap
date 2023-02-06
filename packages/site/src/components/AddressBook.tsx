import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { defaultSnapOrigin } from '../config';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { payrollTransaction } from '../utils';


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

const AddressInput = styled.input`
  margin-top: 10px;
  font-size: 18px;
  width: 100%;
`;
const AddressOwner = styled.input`
  margin-top: 10px;
  font-size: 18px;
  width: 100%;
`;
const AddressCTC = styled.input`
  margin-top: 10px;
  font-size: 18px;
  width: 100%;
`;
const Title = styled.h2`
  margin-top: 0px;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const Button = styled.button`
  align-items: center;
  justify-content: center;
  margin-top: auto;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

interface Details {
  id: number;
  EmployeeAddress: string;
  EmployeeName: string;
  EmployeeCTC: string;
}

interface AddressBook {
  addressBook: Details[]
}

export const AddressBook = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [employeeCTC, setEmployeeCTC] = useState('');
  const aBook: Details[] = [];
  const [addressBook, setAddressBook] = useState<Details[]>(aBook);
  const [toggle, setToggle] = useState(false);
  const [, dispatch] = useContext(MetaMaskContext);
  const handleAddEmployee = async (
    employeeName: string,
    employeeAddress: string,
    employeeCTC: string,
  ) => {
    try {
      const response = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'addEmployee',
            params: { employeeName, employeeAddress, employeeCTC },
          },
        ],
      });
      setToggle(!toggle);
      setEmployeeName('');
      setEmployeeAddress('');
      setEmployeeCTC('');
      alert(`${employeeName} was added to your Address Book`);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };
  const showAddressBook = async () => {
    try {
      const response: any = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'hello',
          },
        ],
      });
      console.log(response);
      setAddressBook(response);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleTransaction = async () => {
    try {
      const TransactionParams: AddressBook= {addressBook: addressBook}
      await payrollTransaction(TransactionParams);
      alert('tx has been sent!');
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }

  const handleClearSnap = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'clear',
          },
        ],
      });
      alert('Address book cleared!');
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };
  useEffect(() => {
    showAddressBook();
  }, [toggle]);
  return (
    <>
      <CardWrapper fullWidth={true} disabled={false}>
        <Title>Add your employees to Address Book!</Title>
        <AddressOwner
          type="text"
          placeholder="Name"
          onChange={(event) => setEmployeeName(event.currentTarget.value)}
          value={employeeName}
        />
        <AddressInput
          type="text"
          placeholder="Address"
          onChange={(event) => setEmployeeAddress(event.currentTarget.value)}
          value={employeeAddress}
        />
        <AddressCTC
          type="text"
          placeholder="CTC"
          onChange={(event) => setEmployeeCTC(event.currentTarget.value)}
          value={employeeCTC}
        />
        <br></br>
        <Button
          onClick={() =>
            handleAddEmployee(employeeName, employeeAddress, employeeCTC)
          }
        >
          Submit
        </Button>
        <br></br>
        <Button onClick={handleClearSnap}>Clear Address Book</Button>
        <br></br>
      </CardWrapper>
      <CardWrapper fullWidth={true} disabled={false}>
        <Title>Send salary to all your employees in a single click!</Title>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "15px" }}>Employee's Name</TableCell>
                <TableCell sx={{ fontSize: "15px" }}>Employee's Address</TableCell>
                <TableCell sx={{ fontSize: "15px" }}>Employee's CTC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addressBook.map((employee) => {
                return (
                  <TableRow>
                    <TableCell sx={{ fontSize: "15px" }}>{employee.EmployeeName}</TableCell>
                    <TableCell sx={{ fontSize: "15px" }}>{employee.EmployeeAddress}</TableCell>
                    <TableCell sx={{ fontSize: "15px" }}>{employee.EmployeeCTC }</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <br></br>
        <Button onClick={handleTransaction}>Run Payroll</Button>
      </CardWrapper>
    </>
  );
};
