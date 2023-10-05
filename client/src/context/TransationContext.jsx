import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext=React.createContext();

const { ethereum }=window;

const getEthereumContract = () => {
  if (!ethereum) {
    console.error("Ethereum object is not available.");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner().then();
  console.log(signer);
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  console.log(transactionsContract);
  return transactionsContract;
}


export const TransactionProvider =({ children }) => {

const [currentAccount, setCurrentAccount] = useState('');
const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
const [isLoading, setIsLoading]= useState(false);

const [ transactionCount, setTransactionCount ]= useState(localStorage.getItem('transactionCount'));

const handleChange = (e, name) =>{
  setformData((prevState)=> ({...prevState, [name]: e.target.value}));
}

const checkIfWalletIsConnected = async () => {
  try {
      if(!ethereum) return alert ("Please install Metamask");

    const accounts=await ethereum.request({method: 'eth_accounts'});

    if(accounts.length){
      setCurrentAccount(accounts[0]);
      //getAllTransactions();

    }
    else{
      console.log("No accounts found.")
    }

    console.log(accounts);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object.");
    }
  }
const connectWallet=async() =>{
  try{
    if(!ethereum) return alert ("Please install Metamask");
    const accounts=await ethereum.request({method: 'eth_requestAccounts'});
    setCurrentAccount(accounts[0]);
  }catch(error){
      console.log(error);
      throw new Error("No Ethereum Object.");
  }
}

const SendTransaction = async () => {
  try{
    if(!ethereum) return alert("Please install Metamask");

    const { addressTo, amount, keyword, message}=formData;
    const transactionsContract = getEthereumContract();
    const parsedAmount=ethers.parseEther(amount);

    await ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: currentAccount,
        to: addressTo,
        gas: "0x5208",
        value: parsedAmount.toString(16),
      }],
    });

    const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
    
    setIsLoading(true);
    console.log(`Loading - ${transactionHash.hash}`);
    await transactionHash.wait();
    setIsLoading(false);
    console.log(`Success - ${transactionHash.hash}`);

    const transactionCount= await transactionsContract.getTransactionCounter();
    setTransactionCount(transactionCount.toNumber());

  }catch(error){
    console.log(error);
    throw new Error("No Ethereum object.")
  }
}

useEffect(() => {
  checkIfWalletIsConnected();
}, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setformData, handleChange, SendTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}