import React, { createContext, useContext, useState } from 'react';

// Create a context to manage wallet related state
const WalletContext = createContext();

// Custom hook to provide access to wallet context
export const useWalletContext = () => {
  return useContext(WalletContext);
};

// Wallet context provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [providers, setProviders] = useState(null);
  const [organisationName, setOrganisationName] = useState('');
  const [organizationaddress, setorganisationaddress] = useState('');
  const [TokenContract, setTokenContract] = useState('');


  const contextValue = {
    walletAddress,
    setWalletAddress,
    providers,
    setProviders,
    organisationName,
    setOrganisationName,
    organizationaddress,
    setorganisationaddress,
    TokenContract,
    setTokenContract
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
