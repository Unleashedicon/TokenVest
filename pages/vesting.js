import { ethers } from "ethers";
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { useWalletContext } from '../context/walletcontext';
import { FiHome } from 'react-icons/fi';

export default function Vest() {
  const contractAddress = process.env.CONTRACT_ADDRESS2
  const abi = process.env.ABI2
  const abied = process.env.ABI3

  const [stakeholders, setStakeholders] = useState([]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);

  const [addressToAdd, setAddressToAdd] = useState('');
  const [addressAdd, setAddressAdd] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [startTimeStamp, setStartTimeStamp] = useState(null);
  const [initialAmount, setInitialAmount] = useState('');
  const [StakeholderType, setStakeholderType] = useState('Community');
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationStatused, setRegistrationStatused] = useState(null);
  const [registrationPendings, setRegistrationPendings] = useState(false);
  const [registrationPending, setRegistrationPending] = useState(false);
  const { walletAddress, providers, TokenContract } = useWalletContext();
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('seconds');
  const convertToUnixTimestamp = (date) => {
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
  };

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

  const formatVestingDetails = (stakeholders) => {
    return stakeholders.map((stakeholder) => {
      const startTime = stakeholder.vestingDetails[0].toString();
      const duration = stakeholder.vestingDetails[1].toString();
      const endVestingTime = stakeholder.vestingDetails[2].toString();
      const initialAmount = stakeholder.vestingDetails[3].toString();
      const stakeholderType = stakeholder.vestingDetails[4].toString();

      const beneficiaryAddress = stakeholder.beneficiaryAddress.toLowerCase();

      const startTimeFormatted = new Date(parseInt(startTime) * 1000).toLocaleString();
      const endVestingTimeFormatted = new Date(parseInt(endVestingTime) * 1000).toLocaleString();
      const typeName = getStakeholderTypeName(stakeholderType);


      return {
        beneficiaryAddress,
        vestingDetails: {
          startTime: startTimeFormatted,
          duration,
          endVestingTime: endVestingTimeFormatted,
          initialAmount,
          typeName,
        },
      };
    });
  };

  const fetchStakeholders = async () => {
    try {
      if (!providers) return;
      const contract = new ethers.Contract(contractAddress, abi, providers);

      const response = await contract.getVestingSchedules(walletAddress);
      // Format vesting details before setting state
      const formattedStakeholders = formatVestingDetails(response);
      setStakeholders(formattedStakeholders);
    } catch (error) {
      console.error('Error fetching stakeholders:', error);
    }
  };

  const fetchWhitelistedAddresses = async () => {
    try {
      if (!providers) return;
      const contract = new ethers.Contract(contractAddress, abi, providers);

      // Fetch whitelisted addresses for the organization using getWhitelistedAddresses function
      const addresses = await contract.getWhitelistedAddresses(walletAddress);
      setWhitelistedAddresses(addresses);
    } catch (error) {
      console.error('Error fetching whitelisted addresses:', error);
    }
  };

function convertDurationToSeconds(value, unit) {
switch (unit) {
  case 'seconds':
    return value;
  case 'minutes':
    return value * 60;
  case 'hours':
    return value * 60 * 60;
  case 'days':
    return value * 24 * 60 * 60;
  default:
    return 0;
}
}
  const handleStartDateChange = (date) => {
    setStartDate(date);
    const startTimeStamp = convertToUnixTimestamp(date);
    setStartTimeStamp(startTimeStamp);
  };

  const addStakeholder = async (event) => {
    event.preventDefault();
    if (!providers) {
      console.error('Provider not available');
      return;
    }
    
    try {
      const durationInSeconds = convertDurationToSeconds(durationValue, durationUnit);  
      let signers;
      if (providers.isMetaMask || providers.isTrust) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signers = provider.getSigner();
      } else {
        signers = providers.getSigner();
      }
      setRegistrationPendings(true);
      const smartContract = new ethers.Contract(contractAddress, abi, signers);
      const tx = await smartContract.addVestingSchedule(addressToAdd, startTimeStamp , durationInSeconds, initialAmount, StakeholderType, { gasLimit: 100000 });
      await tx.wait();

      fetchStakeholders();
 
      setRegistrationStatus({
        success: true,
        message: `Stakeholder added successfully!`,
      });
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setRegistrationStatus({
          success: false,
          message: 'Transaction rejected by the user. Please approve the transaction to register the organization.',
        });
      } else if (
        error.message &&
        error.message.includes('execution reverted: Organization already registered')
      ) {
        setRegistrationStatus({
          success: false,
          message: 'Organization is already registered.',
        });
      }  else if (
        error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
        error.message.includes('execution reverted: Not the owner')
      ) {
        setRegistrationStatus({
          success: false,
          message: 'You are not the admin. Only the admin can perform this action.',
        });
    }
    else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        setRegistrationStatus({
          success: false,
          message: 'Transaction gas estimation failed. Please try again or set a manual gas limit.',
        });
      } else if (error.code === 'NETWORK_ERROR') {
        setRegistrationStatus({
          success: false,
          message: 'Network error. Please ensure you are connected to the correct network.',
        });
      } else {
        setRegistrationStatus({
          success: false,
          message: `Failed to register organization: ${error.message}`,
        });
      }
    } finally {
      setRegistrationPendings(false);
    }
  };

  const whitelistAddress = async (event) => {
    event.preventDefault();
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
      const tx = await smartContract.whitelistAddress(addressAdd);
      await tx.wait();
      const claimableTokens = await smartContract.claimableTokens(addressAdd);
      const tokenContract = new ethers.Contract(TokenContract, abied, signers);
      const approveTx = await tokenContract.approve(addressAdd, claimableTokens, { gasLimit: 100000 });
      await approveTx.wait();
      fetchWhitelistedAddresses();
    
      setRegistrationStatused({
        success: true,
        message: `"${addressAdd}" has been successfully whitelisted!
        `,
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
    else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        setRegistrationStatused({
          success: false,
          message: 'Transaction gas estimation failed. Please try again or set a manual gas limit.',
        });
      } else if (error.code === 'NETWORK_ERROR') {
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

  const removeStakeholder  = async (organizationadd, beneficiaryAddress) => {
    try {
        const signer = providers.getSigner();
        setRegistrationPendings(true);
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.removeBeneficiary(organizationadd, beneficiaryAddress);
        await tx.wait();
        fetchStakeholders()
        console.log('Stakeholder removed successfully');
        setRegistrationStatus({
          success: true,
          message: `"${beneficiaryAddress}" has been removed successfully!
          `,
        });
    } catch (error) {
        console.error('Error removing stakeholder:', error);
    } finally {
      setRegistrationPendings(false);
    }
};
const removeWhitelistedAddress  = async (addressToRemove) => {
  try {
      const signer = providers.getSigner();
      setRegistrationPending(true);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.removeWhitelistedAddress(addressToRemove);
      await tx.wait();
      fetchWhitelistedAddresses()
      console.log('Whitelisted address removed successfully');
      setRegistrationStatused({
        success: true,
        message: `"${addressToRemove}" has been successfully removed!
        `,
      });
  } catch (error) {
      console.error('Error removing Whitelisted Address:', error);
  } finally {
    setRegistrationPending(false);
  }
};

  useEffect(() => {
    fetchStakeholders();
    fetchWhitelistedAddresses();
  }, [walletAddress, providers]);

  useEffect(() => {
  console.log('Whitelisted Addresses:', whitelistedAddresses);
}, [whitelistedAddresses]);

useEffect(() => {
  console.log('Stakeholders:', stakeholders);
}, [stakeholders]);

  return (
    <div className='m-6 space-y-4'>
    <div className="flex items-center">
    <div>
          <Link href="/">
            <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
              <FiHome className="mr-2" />
              <span>Home</span>
            </button>
          </Link>
        </div>
        <div className="flex-grow flex justify-center space-x-20">
          <Link href="/admin">
            <span className="text-blue-500 hover:underline mx-2 cursor-pointer">Register Organization</span>
          </Link>
          <Link href="/vesting">
            <span className="text-blue-500 hover:underline mx-2 cursor-pointer">Add Stakeholders</span>
          </Link>
        </div>
      </div>
    <div className="max-w-md mx-auto">
    <div className="text-center mb-4">
    <h2 className="text-xl font-bold mb-2">Add Stakeholder</h2>
        <input type="text" placeholder="Address to add" value={addressToAdd} onChange={(e) => setAddressToAdd(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-2" />
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Start Time"
        className="w-full border border-gray-300 rounded-md p-2 mb-2"
      />
       <input
            type="number"
            placeholder="Duration Value"
            value={durationValue}
            onChange={(e) => setDurationValue(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          />
          <select
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        <input type="text" placeholder="Initial Amount" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-2" />

        <div className="mb-2">
          <label htmlFor="stakeholderType" className="block mb-1">Stakeholder Type:</label>
          <select
            id="stakeholderType"
            value={StakeholderType}
            onChange={(e) => setStakeholderType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="0">Community</option>
            <option value="1">Investor</option>
            <option value="2">Presale Buyer</option>
            <option value="3">Founder</option>
            <option value="4">Other</option>
          </select>
        </div>


        <button onClick={addStakeholder} className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 mb-2">
          Add Stakeholder
        </button>
        {registrationStatus && (
          <div className="mt-4">
            <p className={registrationStatus.success ? 'text-green-600' : 'text-red-600'}>
              {registrationStatus.message}
            </p>
          </div>
        )}
        {registrationPendings && (
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-gray-600">Loading... Please wait.</p>
            <div className="mt-2 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
            </div>
          </div>
        )}          
         {stakeholders.map((stakeholder, index) => (
        <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
          <h3 className="text-xl font-bold mb-2">Stakeholder {index + 1}</h3>
          <p><strong>Beneficiary Address:</strong> {stakeholder.beneficiaryAddress}</p>
          <p><strong>Start Time:</strong> {stakeholder.vestingDetails.startTime}</p>
          <p><strong>Duration:</strong> {stakeholder.vestingDetails.duration}</p>
          <p><strong>End Vesting Time:</strong> {stakeholder.vestingDetails.endVestingTime}</p>
          <p><strong>Initial Amount:</strong> {stakeholder.vestingDetails.initialAmount}</p>
          <p><strong>Type Name:</strong> {stakeholder.vestingDetails.typeName}</p>
          <button onClick={() => removeStakeholder(walletAddress, stakeholder.beneficiaryAddress)} className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition duration-300">
            Remove
          </button>
        </div>
      ))}


        {/* Whitelisting section */}
        <h2 className="text-xl font-bold mt-4 mb-2">Whitelist Address</h2>
        <input type="text" placeholder="Address to whitelist" value={addressAdd} onChange={(e) => setAddressAdd(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mb-2" />
        <button onClick={whitelistAddress} className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 mb-2">
          Whitelist Address
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
  {whitelistedAddresses.map((address, index) => (
  <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
    <h3 className="text-xl font-bold mb-2">Whitelisted Address {index + 1}</h3>
    <p><strong>Address:</strong> {address}</p>
    <button onClick={() => removeWhitelistedAddress(address)} className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition duration-300">
      Remove
    </button>
  </div>
  ))}

      </div>
      </div>
      </div>
  )
}