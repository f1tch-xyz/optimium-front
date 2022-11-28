import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Container from "@mui/material/Container";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UniswapPool from "./trade";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Provider } from "react-redux";
import store from "../store/store";

const { chains, provider } = configureChains(
  [chain.optimism],
  [
    alchemyProvider({ apiKey: "I_98yCaFloxo_XxxRCjQ1tanl4IcVXs3" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);
  const [hasWeb3, setHasWeb3] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {/* <Provider store={store}> */}
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightTheme({
            borderRadius: "none",
            fontStack: "system",
            overlayBlur: "small",
            accentColor: "lightgrey",
          })}
        >
          <NavBar hasWeb3={hasWeb3} user={user} setUser={setUser} />
          <Container>
            <Component user={user} {...pageProps} />
          </Container>
        </RainbowKitProvider>
      </WagmiConfig>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          This is an error message!
        </Alert>
      </Snackbar>
      {/* </Provider> */}
    </>
  );
}

export default MyApp;
