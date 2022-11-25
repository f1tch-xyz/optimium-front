import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Container from '@mui/material/Container';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UniswapPool from './trade';
import { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';

const { chains, provider } = configureChains([chain.mainnet], [
  alchemyProvider({ apiKey: 'A_kmxXLW8oR7ot5VEGBQYpMD9WxyQtHb' }),
  publicProvider()
]);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function MyApp({ Component, pageProps }: AppProps) {

  const [hasWeb3, setHasWeb3] = useState(false)
  const [user, setUser] = useState('')

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <NavBar hasWeb3={hasWeb3} user={user} setUser={setUser} />
          <Container>
            <Component user={user} {...pageProps} />
          </Container>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;