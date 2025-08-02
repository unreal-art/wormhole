'use client';
import { useState, useEffect } from 'react';
import { HelloNearContract } from '@/config';
import { useWalletSelector } from '@near-wallet-selector/react-hook';

// Contract that the app will interact with
const CONTRACT = HelloNearContract;

export default function HelloNear() {
  const { signedAccountId, viewFunction, callFunction } = useWalletSelector();

  const [greeting, setGreeting] = useState<string>('loading...');
  const [newGreeting, setNewGreeting] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  useEffect(() => {
    viewFunction({ contractId: CONTRACT, method: 'get_greeting' })
      .then(greeting => setGreeting(greeting));
  }, [viewFunction]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  const storeGreeting = async () => {
    setShowSpinner(true);
    await callFunction({ contractId: CONTRACT, method: 'set_greeting', args: { greeting: newGreeting } });
    const greeting = await viewFunction({ contractId: CONTRACT, method: 'get_greeting' });
    setGreeting(greeting);
    setShowSpinner(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 pt-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm mb-8">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Interacting with the contract: &nbsp;
          <code className="font-mono font-bold">{CONTRACT}</code>
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-md p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          The contract says: <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-mono text-primary dark:text-primary-light">{greeting}</code>
        </h1>
        
        {loggedIn ? (
          <div className="flex w-full space-x-2 mb-4">
            <input 
              type="text" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              placeholder="Store a new greeting" 
              onChange={e => setNewGreeting(e.target.value)} 
            />
            <button 
              className="px-4 py-2 text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm"
              onClick={storeGreeting}
              disabled={showSpinner}
            >
              {showSpinner ? (
                <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            Please login to change the greeting
          </p>
        )}
      </div>
    </main>
  );
}
