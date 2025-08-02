'use client';

import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

import '@/app/globals.css';
import { Navigation } from '@/components/navigation';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupMeteorWalletApp } from '@near-wallet-selector/meteor-wallet-app';
import { setupBitteWallet } from '@near-wallet-selector/bitte-wallet';
import { setupEthereumWallets } from '@near-wallet-selector/ethereum-wallets';
import { setupHotWallet } from '@near-wallet-selector/hot-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupSender } from '@near-wallet-selector/sender';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupNearMobileWallet } from '@near-wallet-selector/near-mobile-wallet';
import { setupWelldoneWallet } from '@near-wallet-selector/welldone-wallet';
import { HelloNearContract, NetworkId } from '@/config';
import { WalletSelectorProvider } from '@near-wallet-selector/react-hook';
import { wagmiAdapter, web3Modal } from '@/wallets/web3modal';

const walletSelectorConfig = {
  network: NetworkId,
  // createAccessKeyFor: HelloNearContract,
  modules: [
    setupMeteorWallet(),
    setupEthereumWallets({ wagmiConfig: wagmiAdapter.wagmiConfig, web3Modal }),
    setupBitteWallet(),
    setupMeteorWalletApp({ contractId: HelloNearContract }),
    setupHotWallet(),
    setupLedger(),
    setupSender(),
    setupHereWallet(),
    setupNearMobileWallet(),
    setupWelldoneWallet(),
    setupMyNearWallet(),
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

// Layout Component
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900">
      <body className="h-full">
        <WalletSelectorProvider config={walletSelectorConfig}>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </WalletSelectorProvider>
      </body>
    </html>
  );
}
