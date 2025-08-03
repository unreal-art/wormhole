import { defaultWagmiConfig } from "@web3modal/wagmi/react"
import { Chain } from "wagmi"

import { createWeb3Modal } from "@web3modal/wagmi/react"


// Get your project ID from https://cloud.walletconnect.com
const projectId = "30147604c5f01d0bc4482ab0665b5697"

// Define Etherlink Ghost testnet (wagmi Chain type)
export const etherlinkGhostTestnet: Chain = {
  id: 128123,
  name: "Etherlink Ghost Testnet",
  network: "etherlink-ghost",
  nativeCurrency: {
    name: "TEZ",
    symbol: "TEZ",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://node.ghostnet.etherlink.com"] },
    public: { http: ["https://node.ghostnet.etherlink.com"] },
  },
  blockExplorers: {
    default: { name: "Etherlink Explorer", url: "https://explorer.ghostnet.etherlink.com" },
  },
  testnet: true,
}

// Define chains array
const chains = [etherlinkGhostTestnet];

// Create Wagmi config via Web3Modal helper
export const wagmiConfig = defaultWagmiConfig({
  projectId,
  chains,
  metadata: { name: "UNREAL Swap" }
});

// Initialize Web3Modal once (client-side)
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "dark",
  themeVariables: {
    '--w3m-accent': '#6366f1',
    '--w3m-background-color': '#312e81'
  }
});


