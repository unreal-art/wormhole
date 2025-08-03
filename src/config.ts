interface ContractMap {
  [key: string]: string
}

const contractPerNetwork: ContractMap = {
  mainnet: "hello.near-examples.near",
  testnet: "hello.near-examples.testnet",
}

export const NetworkId: string = "testnet"
export const HelloNearContract: string = contractPerNetwork[NetworkId]

// Etherlink and NEAR contract information from deployment-info.json
export const EtherlinkChainId = 128123
export const EtherlinkContracts = {
  unrealToken: "0xB20302C0962aE621c18520bb8BA6Efc29cC793e0",
  unrealHTLC: "0xbcccb07D3356D12d05562aBB62B363dF5dD4286D",
  unrealBridge: "0xa5D46EBEc77F7B0ceC03ea20Cf652a47c48eA19E",
}

export const NearContracts = {
  htlc: "htlc.unrealai.testnet",
  token: "token.unrealai.testnet",
}

import { etherlinkTestnet } from "viem/chains"

export const ETHERLINK_CHAIN = etherlinkTestnet

// Chain configurations for UI display
export const ChainConfigs = {
  etherlink: {
    name: "Etherlink",
    logo: "/etherlink-logo.svg", // Replace with actual logo path
    chainId: EtherlinkChainId,
    rpcUrl: "https://node.testnet.etherlink.com", // Replace with actual RPC URL
    explorer: "https://explorer.etherlink.com", // Replace with actual explorer URL
    nativeCurrency: {
      name: "TEZ",
      symbol: "TEZ",
      decimals: 18,
    },
  },
  near: {
    name: "NEAR",
    logo: "/near-logo.svg",
    networkId: NetworkId,
    explorer:
      NetworkId === "mainnet"
        ? "https://explorer.near.org"
        : "https://explorer.testnet.near.org",
  },
}
