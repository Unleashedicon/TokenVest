import Link from 'next/link';
import Web3Modal from "web3modal";
import Web3 from 'web3';
import { ethers } from "ethers";
import { useWalletContext } from './walletcontext';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from 'react';


export default function Home() {
  const { walletAddress, setWalletAddress, providers, setProviders, setorganisationaddress, setOrganisationName, setTokenContract } = useWalletContext();
  const contractAddress = process.env.CONTRACT_ADDRESS
  const abi = process.env.ABI
const providerOption = {
  coinbasewallet: {
    package: WalletConnectProvider
  },
}
const [walletButtonStatus, setWalletButtonStatus] = useState('Connect Wallet');

const updateWalletStatus = () => {
  if (walletAddress && walletAddress.length > 0) {
    setWalletButtonStatus(`Connected: ${walletAddress.substring(0, 6)} ...${walletAddress.substring(38)}`);
  } else {
    setWalletButtonStatus('Connect Wallet');
  }
};


const handleSetWalletAddress = (address) => {
  setWalletAddress(address);
  updateWalletStatus();
};

const connectWallet = async () => {
  try {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOption,
    });

    const connectedProvider = await web3Modal.connect();

    if (connectedProvider) {
      const web3 = new Web3(connectedProvider);
      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        handleSetWalletAddress(accounts[0]);
        console.log(accounts[0]);
        setProviders(new ethers.providers.Web3Provider(connectedProvider));
        const contract = new ethers.Contract(contractAddress, abi, new ethers.providers.Web3Provider(window.ethereum));
        const organizationDetails = await contract.getOrganizationDetails(accounts[0]);
        const [orgName, organizationAddress, tokenContractAddress] = organizationDetails;

        console.log('Organization Name:', orgName);
        console.log('Organization Address:', organizationAddress);
        console.log('Token Contract Address:', tokenContractAddress);

        setorganisationaddress(organizationAddress);
        setOrganisationName(orgName);
        setTokenContract(tokenContractAddress)
      } else {
        console.log('Connect your wallet to continue');
      }
    } else {
      console.log('Provider not available');
    }
  } catch (err) {
    console.error(err.message);
  }
};


const handleConnectButtonClick = () => {
  if (walletAddress && walletAddress.length > 0) {
    setWalletAddress('');
  } else {
    connectWallet();
  }
}

const addWallet = async () => {
  try {
    if (providers) {
      providers.on('accountsChanged', (accounts) => {
        handleSetWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      handleSetWalletAddress('');
    }
  } catch (err) {
    console.error(err.message);
  }
};

useEffect(() => {
  addWallet();
  updateWalletStatus();
}, [walletAddress]);

return (
  <div
    className="flex flex-col items-center"
    style={{
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "20px", 
      position: "relative",
    }}
  >
    <div className="absolute top-0 right-0 mt-6 mr-6">
    <button
          onClick={handleConnectButtonClick}
          className="px-4 py-1 bg-slate-300 hover:bg-slate-500 flex justify-around transition-all rounded-md"
        >
          <span>{walletButtonStatus}</span>
        </button>
    </div>

    <div className='space-y-4'>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex justify-center space-x-4">
          <Link href="/admin">
            <button className="bg-blue-500 text-white rounded-md py-3 px-6 hover:bg-blue-600 transition duration-300">
              Admin
            </button>
          </Link>
          <Link href="/user">
            <button className="bg-green-500 text-white rounded-md py-3 px-6 hover:bg-green-600 transition duration-300">
              User
            </button>
          </Link>
        </div>
        <p className="text-white-800 text-lg mt-4">Choose your role</p>
      </div>
    </div>
  </div>
);
}