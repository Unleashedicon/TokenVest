import '../styles/globals.css'
import { WalletProvider } from './walletcontext';

function MyApp({ Component, pageProps }) {
  return(
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp
