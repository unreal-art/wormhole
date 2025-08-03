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
// Import ThirdwebProvider for Ethereum wallet support
import { ThirdwebProvider } from '@/providers/ThirdwebProvider';

const walletSelectorConfig = {
  network: NetworkId,
  // createAccessKeyFor: HelloNearContract,
  modules: [
    setupMeteorWallet(),
    // Removed setupEthereumWallets since we're now using ThirdWeb
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
    <html lang="en" className="h-full bg-gradient-to-b from-indigo-950 to-purple-900 text-white">
      <body className="h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
        {/* Wrap the app with ThirdwebProvider for Ethereum wallet integration */}
        <ThirdwebProvider>
          {/* Keep WalletSelectorProvider for NEAR wallet integration */}
          <WalletSelectorProvider config={walletSelectorConfig}>
            <Navigation />
            <main className="container mx-auto px-4 py-8 mt-20 rounded-xl bg-white/10 backdrop-blur-sm shadow-xl border border-purple-500/30 text-white">
              {children}
            </main>
          </WalletSelectorProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
