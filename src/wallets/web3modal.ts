import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { createAppKit } from "@reown/appkit/react"
import { reconnect } from "@wagmi/core"
import { EtherlinkChainId } from "@/config"

// Get a project ID at https://cloud.reown.com
const projectId = "30147604c5f01d0bc4482ab0665b5697"

// Define Etherlink Ghost testnet
const etherlinkGhostTestnet = {
  id: EtherlinkChainId, // 128123
  name: "Etherlink Ghost Testnet",
  network: "etherlink-ghost",
  nativeCurrency: {
    name: "TEZ",
    symbol: "TEZ",
    decimals: 18
  },
  rpcUrls: {
    default: { http: ["https://node.ghostnet.etherlink.com"] },
    public: { http: ["https://node.ghostnet.etherlink.com"] }
  },
  blockExplorers: {
    default: { name: "Etherlink Explorer", url: "https://explorer.ghostnet.etherlink.com" }
  },
  testnet: true
}

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [etherlinkGhostTestnet],
})

export const web3Modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [etherlinkGhostTestnet],
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
