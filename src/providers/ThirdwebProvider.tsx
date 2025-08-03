import { ThirdwebProvider as ThirdwebProviderBase } from "@thirdweb-dev/react"
import { ReactNode } from "react"
import { Chain } from "@thirdweb-dev/chains"
import { EtherlinkChainId } from "@/config"

// Define Etherlink Ghost testnet chain for thirdweb
const etherlinkGhostTestnet: Chain = {
  id: EtherlinkChainId, // 128123
  name: "Etherlink Ghost Testnet",
  nativeCurrency: {
    name: "TEZ",
    symbol: "TEZ",
    decimals: 18,
  },
  rpc: ["https://node.ghostnet.etherlink.com"],
  shortName: "etherlink",
  slug: "etherlink-ghost-testnet",
  testnet: true,
  chain: "etherlink",
  explorers: [
    {
      name: "Etherlink Explorer",
      url: "https://explorer.ghostnet.etherlink.com",
    },
  ],
}

// Only support Etherlink Ghost testnet
const supportedChains = [etherlinkGhostTestnet]

interface ThirdwebProviderProps {
  children: ReactNode
}

export function ThirdwebProvider({ children }: ThirdwebProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID

  return (
    <ThirdwebProviderBase
      clientId={clientId}
      activeChain={etherlinkGhostTestnet}
      supportedChains={supportedChains}
      // Disable all wallet connectors that might cause issues
      walletConnectors={[
        // Only include the most basic connectors
        { id: "metamask", recommended: true },
        { id: "coinbase" },
        { id: "walletConnect" },
        { id: "injected" }
      ]}
    >
      {children}
    </ThirdwebProviderBase>
  )
}
