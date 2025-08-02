import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { nearTestnet } from "@reown/appkit/networks";
import { reconnect } from "@wagmi/core";
import { EtherlinkChainId } from "@/config";

// Get a project ID at https://cloud.reown.com
const projectId = "30147604c5f01d0bc4482ab0665b5697";

// Custom Etherlink chain config for @reown/appkit
const etherlinkTestnet = {
  id: EtherlinkChainId,
  name: "Etherlink Testnet",
  network: "etherlink-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "TEZ",
    symbol: "TEZ",
  },
  rpcUrls: {
    public: { http: ["https://node.testnet.etherlink.com"] },
    default: { http: ["https://node.testnet.etherlink.com"] },
  },
  blockExplorers: {
    default: { name: "Etherlink Explorer", url: "https://explorer.etherlink.com" },
  },
  testnet: true,
};

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [nearTestnet, etherlinkTestnet],
});

export const web3Modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [nearTestnet, etherlinkTestnet],
  enableWalletConnect: true,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: false, // Smart accounts (Safe contract) not available on NEAR Protocol, only EOA.
    socials: false, // Smart accounts (Safe contract) not available on NEAR Protocol, only EOA.
  },
  coinbasePreference: "eoaOnly", // Smart accounts (Safe contract) not available on NEAR Protocol, only EOA.
  allWallets: "SHOW",
});
