'use client';

import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { useEffect, useState } from 'react';
import { NearContracts } from '@/config';

const TestNearConnection = () => {
  const { signedAccountId, signIn, signOut, viewFunction } = useWalletSelector();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!signedAccountId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tokenBalance = await viewFunction({
        contractId: NearContracts.token,
        method: 'ft_balance_of',
        args: { account_id: signedAccountId }
      }) as string;
      
      setBalance(tokenBalance || '0');
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (signedAccountId) {
      fetchBalance();
    } else {
      setBalance('0');
    }
  }, [signedAccountId]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg mt-8">
      <h3 className="text-lg font-semibold mb-2">NEAR Connection Test</h3>
      
      {!signedAccountId ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Connect your NEAR wallet to test the connection</p>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Connect NEAR Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connected as:</span>
            <span className="font-mono text-sm">{signedAccountId}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">UNREAL Balance:</span>
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="h-4 w-16 animate-pulse bg-gray-700 rounded"></div>
              ) : (
                <span className="font-mono text-sm">{balance} UNREAL</span>
              )}
              <button
                onClick={fetchBalance}
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-2 p-2 text-xs text-red-400 bg-red-900/50 rounded">
              Error: {error}
            </div>
          )}
          
          <div className="pt-2">
            <button
              onClick={() => signOut()}
              className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestNearConnection;
