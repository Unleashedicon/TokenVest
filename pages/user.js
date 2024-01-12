import { ethers } from "ethers";
// A single Web3 / Ethereum provider solution for all Wallets
import Link from 'next/link';

// react hooks for setting and changing states of variables
import { useEffect, useState } from 'react';
import { useWalletContext } from './walletcontext';
import { FiHome } from 'react-icons/fi';
export default function User() {
    const contractAddress = process.env.CONTRACT_ADDRESS2
    const abi = process.env.ABI2
    const abied = process.env.ABI3
    const contractAddress2 = process.env.CONTRACT_ADDRESS
    const abi2 = process.env.ABI

  // env variables are initalised
  // contractAddress is deployed smart contract addressed 
  const { walletAddress, providers } = useWalletContext();
  const [registrationPending, setRegistrationPending] = useState(false);
  const [organizationSchedules, setOrganizationSchedules] = useState([]);
  const [isAddressWhitelisted, setIsAddressWhitelisted] = useState(false);
  const [registrationStatused, setRegistrationStatused] = useState(null);
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState(null);
  const [TokenContract, setTokenContract] = useState('');

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    let duration = '';
    if (hours > 0) {
      duration += hours + 'h ';
    }
    if (minutes > 0) {
      duration += minutes + 'm ';
    }
    if (remainingSeconds > 0) {
      duration += remainingSeconds + 's';
    }
  
    return duration.trim();
  }

  function getStakeholderTypeName(typeNumber) {
    const types = {
      '0': 'Community',
      '1': 'Investor',
      '2': 'Presale Buyer',
      '3': 'Founder',
      '4': 'Other'
    };
  
    return types[typeNumber.toString()];
  }
  const formatOrganizationSchedules = (data) => {
    const startTime = new Date(parseInt(data[0]) * 1000).toLocaleString();
    const duration = data[1].toString();
    const endVestingTime = new Date(parseInt(data[2]) * 1000).toLocaleString();
    const initialAmount = data[3].toString();
    const stakeholderType = data[4].toString();
    const typeName = getStakeholderTypeName(stakeholderType);
    const formattedDuration = formatDuration(duration);

    return {
      startTime,
      formattedDuration,
      endVestingTime,
      initialAmount,
      typeName,
    };
  };
  
  const fetchData = async () => {
    try {
      if (!providers) return;

      const signer = providers.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const schedules = await contract.getOrganizationAndVestingSchedules(walletAddress);
      const formattedStakeholders = formatOrganizationSchedules(schedules);
      setOrganizationSchedules(formattedStakeholders);

      const isWhitelisted = await contract.isAddressWhitelisted(walletAddress);
      setIsAddressWhitelisted(isWhitelisted);

      console.log('Organization Schedules:', formattedStakeholders);
      console.log('Is Address Whitelisted:', isWhitelisted);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [providers, walletAddress]);

  const withdrawTokens = async (beneficiaryAddress) => {
    if (!providers) {
      console.error('Provider not available');
      return;
    }
  
    try {
      let signers;
      if (providers.isMetaMask || providers.isTrust) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signers = provider.getSigner();
      } else {
        signers = providers.getSigner();
      }
      
      setRegistrationPending(true);
      const smartContract = new ethers.Contract(contractAddress, abi, signers);
      const gasLimit = 1000000;

      const tx = await smartContract.claimTokens(beneficiaryAddress, { gasLimit });
      await tx.wait();
  
      setRegistrationStatused({
        success: true,
        message: 'Tokens withdrawn',
      });
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setRegistrationStatused({
          success: false,
          message: 'Transaction rejected by the user. Please approve the transaction to register the organization.',
        });
      } else if (
        error.message &&
        error.message.includes('execution reverted: Organization already registered')
      ) {
        setRegistrationStatused({
          success: false,
          message: 'Address is already whitelisted.',
        });
      } else if (
        error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
        error.message.includes('execution reverted: Not the owner')
      ) {
        setRegistrationStatused({
          success: false,
          message: 'You are not the admin. Only the admin can perform this action.',
        });
    }
    else if (
      error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
      error.message.includes('execution reverted: Vesting period not ended')
    ) {
      setRegistrationStatused({
        success: false,
        message: 'Vesting period not ended',
      });
  }
 else if (error.code === 'NETWORK_ERROR') {
        setRegistrationStatused({
          success: false,
          message: 'Network error. Please ensure you are connected to the correct network.',
        });
      } else {
        setRegistrationStatused({
          success: false,
          message: `Failed to register organization: ${error.message}`,
        });
      }
    } finally {
      setRegistrationPending(false);
    }
  };

  const transferTokens = async (recipientAddress, amount) => {
  if (!providers || !contractAddress) {
    console.error('Provider or contract address not available');
    return;
  }

  try {
    let signers;
    if (providers.isMetaMask || providers.isTrust) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      signers = provider.getSigner();
    } else {
      signers = providers.getSigner();
    }
      setRegistrationPending(true);

    const contract = new ethers.Contract(TokenContract, abied, signers);
    const manualGasLimit = 10000000;

    const tx = await contract.transfer(recipientAddress, 30, { gasLimit: manualGasLimit });

    // Wait for the transaction to be mined
    await tx.wait();

      setRegistrationStatused({
        success: true,
        message: 'Tokens withdrawn',
      });
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setRegistrationStatused({
          success: false,
          message: 'Transaction rejected by the user. Please approve the transaction to register the organization.',
        });
      } else if (
        error.message &&
        error.message.includes('execution reverted: Organization already registered')
      ) {
        setRegistrationStatused({
          success: false,
          message: 'Address is already whitelisted.',
        });
      } else if (
        error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
        error.message.includes('execution reverted: Not the owner')
      ) {
        setRegistrationStatused({
          success: false,
          message: 'You are not the admin. Only the admin can perform this action.',
        });
    }
    else if (
      error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
      error.message.includes('execution reverted: Vesting period not ended')
    ) {
      setRegistrationStatused({
        success: false,
        message: 'Vesting period not ended',
      });
  }
 else if (error.code === 'NETWORK_ERROR') {
        setRegistrationStatused({
          success: false,
          message: 'Network error. Please ensure you are connected to the correct network.',
        });
      } else {
        setRegistrationStatused({
          success: false,
          message: `Failed to register organization: ${error.message}`,
        });
      }
    } finally {
      setRegistrationPending(false);
    }
  };
  const checkTokenBalance = async () => {
    if (!providers || !contractAddress) {
      console.error('Provider or contract address not available');
      return;
    }
  
    try {
      let signers;
      if (providers.isMetaMask || providers.isTrust) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signers = provider.getSigner();
      } else {
        signers = providers.getSigner();
      }
      const Token = new ethers.Contract(contractAddress2, abi2, new ethers.providers.Web3Provider(window.ethereum));
      const organizationDetails = await Token.getOrganizationDetails('0x461d9eD7FE07F35F2ABC60C85ee8226446e855Aa');
      const [orgName, organizationAddress, tokenContractAddress] = organizationDetails;

      console.log('Organization Name:', orgName);
      console.log('Organization Address:', organizationAddress);
      console.log('Token Contract Address:', tokenContractAddress);

      setTokenContract(tokenContractAddress)
      const contract = new ethers.Contract(TokenContract, abied, signers);

      const balance = await contract.balanceOf(walletAddress);
      console.log(balance);
      setTokenBalance(balance.toString());
    } catch (error) {
      console.error('Error checking token balance:', error);
    }
  };
  useEffect(() => {
    // Fetch token balance when the component mounts
    checkTokenBalance();
  }, [providers, TokenContract, walletAddress]);

  return (
    <div className="container mx-auto p-4">
    <div>
      <div className="mb-4">
        <Link href="/">
          <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
            <FiHome className="mr-2" />
            <span>Home</span>
          </button>
        </Link>
      </div>
  
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Organization Vesting Schedules</h2>
        <div className="border border-gray-300 rounded-md p-4 mb-4">
          <div className="mb-2">
            <strong>Start Time:</strong> {organizationSchedules.startTime}
          </div>
          <div className="mb-2">
            <strong>Duration:</strong> {organizationSchedules.formattedDuration}
          </div>
          <div className="mb-2">
            <strong>End Vesting Time:</strong> {organizationSchedules.endVestingTime}
          </div>
          <div className="mb-2">
            <strong>Initial Amount:</strong> {organizationSchedules.initialAmount}
          </div>
          <div className="mb-2">
            <strong>Type Name:</strong> {organizationSchedules.typeName}
          </div>
        </div>
      </div>
  
      <div>
    <h2 className="text-lg font-bold">Address Whitelisting Status</h2>
    <p style={{ color: isAddressWhitelisted ? 'green' : 'red' }} className="mb-4">
  {isAddressWhitelisted ? 'Yes' : 'No'}
    </p>
    </div>
    <input
      type="text"
      placeholder="Enter beneficiary address"
      onChange={(e) => setBeneficiaryAddress(e.target.value)} // Store the beneficiary address in state
      className="w-full border border-gray-300 rounded-md p-2 mb-2"/>
    <button
      className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 mb-2"
      onClick={() => withdrawTokens(beneficiaryAddress)} // Call the withdrawal function with the beneficiary address
    >
      Withdraw Tokens
    </button>

      {registrationStatused && (
          <div className="mt-4">
            <p className={registrationStatused.success ? 'text-green-600' : 'text-red-600'}>
              {registrationStatused.message}
            </p>
          </div>
        )}
        {registrationPending && (
    <div className="bg-gray-100 p-4 rounded-md">
      <p className="text-gray-600">Loading... Please wait.</p>
      <div className="mt-2 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  )}  
   <div>
          <h2 className="text-lg font-bold">Token Contract Balance</h2>
          <p className="text-green-600">Token Contract Address: {TokenContract}</p>
            <p className="text-green-600">
              Token Balance: {tokenBalance}
            </p>
        </div>
    </div>
    </div>
  );
  
}