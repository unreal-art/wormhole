import { ThirdwebProvider as ThirdwebProviderBase } from "@thirdweb-dev/react";
import { ReactNode } from "react";
import { Ethereum, Polygon, Goerli, Sepolia } from "@thirdweb-dev/chains";

// Configure your supported chains here
const supportedChains = [Ethereum, Polygon, Goerli, Sepolia];

// Network mapping - add other networks as needed
const getActiveChain = (networkId?: string) => {
  switch (networkId?.toLowerCase()) {
    case "ethereum":
      return Ethereum;
    case "polygon":
      return Polygon;
    case "goerli":
      return Goerli;
    case "sepolia":
      return Sepolia;
    default:
      return Ethereum; // Default to Ethereum mainnet
  }
};

interface ThirdwebProviderProps {
  children: ReactNode;
}

export function ThirdwebProvider({ children }: ThirdwebProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  const activeChain = getActiveChain(process.env.NEXT_PUBLIC_NETWORK_ID);
  
  return (
    <ThirdwebProviderBase
      clientId={clientId}
      activeChain={activeChain}
      supportedChains={supportedChains}
    >
      {children}
    </ThirdwebProviderBase>
  );
}
