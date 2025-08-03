'use client';

import { ReactNode } from 'react';
import '@/app/globals.css';
import { Navigation } from '@/components/navigation';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { NearContracts, NetworkId } from '@/config';
import { WalletSelectorProvider } from '@near-wallet-selector/react-hook';
// Import Web3Modal for Ethereum wallet support
import { wagmiConfig } from "@/wallets/web3modal";
import { WagmiConfig } from "wagmi";

// Create wallet selector config with minimal required wallets
const walletSelectorConfig = {
  network: NetworkId as 'testnet' | 'mainnet',
  debug: true,
  selectorOptions: {
    accountId: undefined,
    contractId: NearContracts.token,
  },
  // Only include essential wallet modules to avoid type issues
  modules: [
    // MyNearWallet is the most commonly used wallet
    setupMyNearWallet({
      walletUrl: NetworkId === 'testnet' 
        ? 'https://testnet.mynearwallet.com'
        : 'https://app.mynearwallet.com',
    }),
    // Add Meteor Wallet as a fallback
    setupMeteorWallet(),
  ],
  // Explicitly set the RPC URL for NEAR
  provider: {
    type: 'JsonRpcProvider',
    args: {
      url: NetworkId === 'testnet' 
        ? 'https://rpc.testnet.near.org' 
        : 'https://rpc.mainnet.near.org',
      headers: {}
    }
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

// Layout Component
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full bg-gradient-to-b from-indigo-950 to-purple-900 text-white">
      <body className="h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
        {/* WagmiConfig for Ethereum wallet hooks */}
        <WagmiConfig config={wagmiConfig}>
          {/* Keep WalletSelectorProvider for NEAR wallet integration */}
          <WalletSelectorProvider config={walletSelectorConfig}>
            <Navigation />
            <main className="container mx-auto px-4 py-8 mt-20 rounded-xl bg-white/10 backdrop-blur-sm shadow-xl border border-purple-500/30">
              {children}
            </main>
          </WalletSelectorProvider>
          {/* Web3modal will automatically render the modal UI */}
        </WagmiConfig>
      </body>
    </html>
  )
}
