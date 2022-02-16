import Web3 from 'web3';
import './App.css';
import {useEffect, useState} from 'react';

const jsonData= require('./ToDoList.json'); 
var jsonString = JSON.stringify(jsonData);
var contract = JSON.parse(jsonString);


function App(props) {
  const [account, setAccount] = useState("");

  const loadBlockchainData = async () => {
    const w3 = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/7655e52c1f2a42889cf096645ebfe8b5");
    const network = await w3.eth.net.getNetworkType();
    // await window.ethereum.enable();
    // const accounts = await w3.eth.getAccounts();
    const accounts = await w3.eth.requestAccounts();
    console.log("NETWORK : ", network);
    console.log("NETWORK : ", accounts[0]);
    setAccount(accounts[0]);

    console.log(contract.abi);
    const CONTRACT_ABI = contract.abi;
    const CONTRACT_BYTECODE = contract.bytecode;
    const CONTRACT_ADDRESS = contract.networks[5777].address;
    const PRIVATE_KEY = "0xe4c7faf7dac7eda67140e6f93992552c1678f8ac8883824ae45d2e889a2539aa";

    const accountInfo = {
      privateKey: accounts[0],
      address: PRIVATE_KEY,
    };

    //Next, we are going to create a contract object.
    // In order to create the contract object, we will use the contract abi
    let contractObject = new w3.eth.Contract(CONTRACT_ABI);

    //In order to deploy the contract, the bytecode of the contract is one of the send function arguments.
    let payload = {
      data: CONTRACT_BYTECODE
    }

    // We are going to need an Ethereum account for contract deployment.
    // 
    //Next, we also need to provide metadata for contract deployment.
    // from: The account which will be used to deploy the contract. 
    //       The account needs to have ether, in order to deploy the contract.
    // gas: The max limit on the cost, the account is willing to incur for contract deployment. 
    //      If the cost goes above this value. The contract deployment will be reverted.
    // gasPrice: The price of each unit of gas the account is willing to pay. 
    //           The transactions get prioritized Based on the gasPrice.
    let parameter = {
      from: accounts[0],
      gas: w3.utils.toHex(800000),
      gasPrice: w3.utils.toHex(w3.utils.toWei('30', 'gwei'))
    }

    // create constructor
    const txConst = contractObject.deploy(payload);


    // Sign Transacation and Send
    const createTransaction = await w3.eth.accounts.signTransaction(
      {
        data: txConst.encodeABI(),
        gas: await txConst.estimateGas(),
      },
      PRIVATE_KEY
    );

    // Send Tx and Wait for Receipt
    const createReceipt = await w3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    // console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);


    // contractObject.deploy(payload).send(parameter, (err, transactionHash) => {
    //   console.log('Transaction Hash :', transactionHash);
    // }).on('confirmation', () => {}).then((newContractInstance) => {
    //   console.log('Deployed Contract Address : ', newContractInstance.options.address);
    // });
  }

  useEffect(() => { 
    // tarayıcının başlık bölümünü değiştirmemizi sağlar
    loadBlockchainData();
  });


  return (
    <div className="container">
        <h1> Hello Motherfucker</h1>
        <p> Your Account : {account}  </p>
    </div>
  );
}

export default App;
