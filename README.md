# @metamask/paysnap

## PaySnap
PaySnap aims to create a payroll management service for an organization by batching transactions to multiple addressses, and helps maintain an address book of your organization, with designated transaction amount to the addresses.

## Aim of the project
This project aims to build an enterprise finance management system on MetaMask starting with a payroll management system, and an address book. We aim to other add-ons on this snap which include features like split expense (splitting an expense amongst many people), multiple organization management, and others.

## Getting Started

Clone the repository and setup the development environment:

```shell
git clone https://github.com/devansh7061/Payroll-Snap
cd PayRoll-Snap
```

To run server:
```shell
cd packages/server
```
Create a `.env` file here and add the following:
```shell
RPC_ENDPOINT=
BUNDLER_URL=
ENTRY_POINT_ADDRESS=
```
Run the server using the following command:
```shell
yarn install && yarn run dev
```
Then run the following command to start the snap:
```shell
yarn install && yarn start
```
