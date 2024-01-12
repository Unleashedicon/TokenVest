import '../styles/globals.css'
import { WalletProvider } from '../context/walletcontext';

function MyApp({ Component, pageProps }) {
  return(
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp
