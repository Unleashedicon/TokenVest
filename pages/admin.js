import { ethers } from "ethers";
import Link from 'next/link';
import { useState } from 'react';
import { useWalletContext } from './walletcontext';
import { FiHome } from 'react-icons/fi';

export default function Admin() {
  const contractAddress = process.env.CONTRACT_ADDRESS
  const abi = process.env.ABI

  const [registrationPending, setRegistrationPending] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const { walletAddress,providers, setorganisationaddress, organizationaddress, organisationName, setOrganisationName } = useWalletContext();

   
  
  const registerOrganization = async (event) => {
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
      const tx = await smartContract.registerOrganization(orgName, tokenName, tokenSymbol);
      await tx.wait();
      const organizationDetails = await smartContract.getOrganizationDetails(walletAddress);
      const [, organizationAddress] = organizationDetails;

      setorganisationaddress(organizationAddress);
      setOrganisationName(orgName);
      setRegistrationStatus({
        success: true,
        message: `Organization "${orgName}" registered successfully!`,
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
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
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
      setRegistrationPending(false);
    }
  };

  const removeOrganization = async () => {
    try {
        const signer = providers.getSigner();
        setRegistrationPending(true);
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.removeOrganization(organizationaddress);
        await tx.wait();
        setorganisationaddress('');
        console.log('Organization removed successfully');
        setRegistrationStatus({
          success: true,
          message: `Organization "${orgName}" removed successfully!`,
        });
    } catch (error) {
        console.error('Error removing organization:', error);
    } finally {
      setRegistrationPending(false);
    }
};


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
    <h2 className="text-2xl font-bold">Register Organization</h2>
    <p className="text-gray-600">Fill in the details below to register your organization</p>
  </div>
  <form onSubmit={registerOrganization} className="space-y-4">
    <div>
      <label htmlFor="orgName" className="block">Organization Name:</label>
      <input
        type="text"
        id="orgName"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        required
      />
    </div>
    <div>
      <label htmlFor="tokenName" className="block">Token Name:</label>
      <input
        type="text"
        id="tokenName"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        required
      />
    </div>
    <div>
      <label htmlFor="tokenSymbol" className="block">Token Symbol:</label>
      <input
        type="text"
        id="tokenSymbol"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        required
      />
    </div>
    <button
      type="submit" onSubmit={registerOrganization}
      className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300"
    >
      Register Organization
    </button>
  </form>

  {registrationStatus && (
    <div className="mt-4">
      <p className={registrationStatus.success ? 'text-green-600' : 'text-red-600'}>
        {registrationStatus.message}
      </p>
    </div>
  )}
  {organizationaddress && (
          <div className="mt-4">
            <p><strong>Organization Name:</strong> {organisationName}</p>
            <p><strong>Organization Address:</strong> {organizationaddress}</p>
            <button
              onClick={removeOrganization}
              className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition duration-300 mb-2"
            >
              Remove Organization
            </button>
          </div>
  )}
  {registrationPending && (
    <div className="bg-gray-100 p-4 rounded-md">
      <p className="text-gray-600">Loading... Please wait.</p>
      <div className="mt-2 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
      </div>
    </div>
  )}  
</div>

    </div>
  )
}
