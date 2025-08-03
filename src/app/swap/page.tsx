'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { ChainConfigs, EtherlinkContracts, NearContracts } from '@/config';
import { DutchAuctionBox } from '@/components/DutchAuctionBox';
import { createPublicClient, http, parseEther, parseUnits } from 'viem';
import { getWalletClient, getTokenBalance as getEtherlinkBalance, approveToken, lockTokens as lockEtherlinkTokens } from '@/utils/etherlinkContract';
import { useNearContract } from '@/utils/nearContract';
import { getSwapQuote, formatTokenAmount } from '@/utils/oneInchApi';
import { utils } from 'near-api-js';

// Token image placeholder (replace with actual UNREAL token logo)
const UnrealLogoPath = '/unreal-logo.svg';

export default function SwapPage() {
  // Dutch auction commit state
  const [auctionNonce, setAuctionNonce] = useState<number>(0);
  const [fakeSignature, setFakeSignature] = useState<string>('');
  const { signedAccountId, signIn } = useWalletSelector();
  const nearContract = useNearContract();
  
  // UI state
  const [amount, setAmount] = useState<string>('');
  const [sourceChain, setSourceChain] = useState<'etherlink' | 'near'>('etherlink');
  const [targetChain, setTargetChain] = useState<'etherlink' | 'near'>('near');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [swapStatus, setSwapStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
  
  // Wallet state
  const [evmAddress, setEvmAddress] = useState<`0x${string}` | null>(null);
  const [etherlinkBalance, setEtherlinkBalance] = useState<string>('0');
  const [nearBalance, setNearBalance] = useState<string>('0');
  
  // 1inch API states
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [swapQuote, setSwapQuote] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(''); // In production, store API key in env variables
  const [swapSecret, setSwapSecret] = useState<string>('');
  const [swapHash, setSwapHash] = useState<string>('');
  
  // Swap chains function
  const handleSwapChains = () => {
    setSourceChain(targetChain);
    setTargetChain(sourceChain);
  };

  // Handle amount change with input validation and fetch quote if possible
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
      
      // If we have a valid amount, wallet address, and source chain is Etherlink, get a quote
      if (value && parseFloat(value) > 0 && evmAddress && sourceChain === 'etherlink' && apiKey) {
        try {
          setQuoteLoading(true);
          // Convert amount to wei (18 decimals)
          const amountWei = BigInt(Math.floor(parseFloat(value) * Math.pow(10, 18))).toString();
          
          // Use 1inch API to get quote
          getSwapQuote(
            EtherlinkContracts.unrealToken, // From UNREAL on Etherlink
            EtherlinkContracts.unrealToken, // To UNREAL on Etherlink (same token for demo)
            amountWei,
            apiKey
          ).then((quote) => {
            // Format the quote amount
            setSwapQuote(formatTokenAmount(quote.toAmount, 18));
            setQuoteLoading(false);
          }).catch((error) => {
            console.error('Error getting swap quote:', error);
            setSwapQuote(null);
            setQuoteLoading(false);
          });
        } catch (error) {
          console.error('Error preparing swap quote:', error);
          setSwapQuote(null);
          setQuoteLoading(false);
        }
      } else {
        setSwapQuote(null);
      }
    }
  };
  
  // Connect EVM wallet and get balances
  useEffect(() => {
    const connectEtherlinkWallet = async () => {
      try {
        const walletClient = await getWalletClient();
        if (walletClient) {
          const addresses = await walletClient.getAddresses();
          if (addresses.length > 0) {
            setEvmAddress(addresses[0]);
            
            // Get token balance
            const balance = await getEtherlinkBalance(addresses[0]);
            setEtherlinkBalance(balance.formatted);
          }
        }
      } catch (error) {
        console.error('Error connecting to Etherlink wallet:', error);
      }
    };

    connectEtherlinkWallet();
  }, []);
  
  // Get NEAR balance when signed in
  useEffect(() => {
    const getNearBalance = async () => {
      if (signedAccountId) {
        try {
          const balance = await nearContract.getTokenBalance(signedAccountId);
          setNearBalance(utils.format.formatNearAmount(balance));
        } catch (error) {
          console.error('Error getting NEAR balance:', error);
        }
      }
    };
    
    getNearBalance();
  }, [signedAccountId, nearContract]);

  // Generate random hash and secret for HTLC
  useEffect(() => {
    // Generate a random secret for HTLC
    const secret = `0x${Array.from({length: 32}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setSwapSecret(secret);
    
    // Generate hash of the secret
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = `0x${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
      setSwapHash(hashHex);
    });
  }, []);
  
  // Handle swap action
  const handleSwap = async () => {
    if ((!signedAccountId && sourceChain === 'near') || 
        (!evmAddress && sourceChain === 'etherlink') || 
        !amount || 
        parseFloat(amount) <= 0 ||
        !swapHash) {
      return;
    }
    
    setIsLoading(true);
    setSwapStatus('pending');
    
    try {
      // Determine which direction we're swapping
      let nonce = 0;
      let signature = '';
      if (sourceChain === 'etherlink' && targetChain === 'near') {
        // Etherlink -> NEAR
        if (!evmAddress || !signedAccountId) {
          throw new Error('Both wallets must be connected');
        }
        
        // Fetch ERC20 nonce FIRST (simulate by getting transaction count for demo)
        try {
          const publicClient = createPublicClient({
            chain: ChainConfigs.etherlink,
            transport: http(ChainConfigs.etherlink.rpcUrls[0]),
          });
          nonce = await publicClient.getTransactionCount({ address: evmAddress });
        } catch (e) { nonce = Math.floor(Math.random()*1000); }
        setAuctionNonce(nonce);
        
        // Sign commit with EVM wallet BEFORE swap (wallet popup appears immediately)
        try {
          const walletClient = await getWalletClient();
          if (walletClient && evmAddress) {
            const commitMsg = `Commit|Token:${EtherlinkContracts.unrealToken}|Nonce:${nonce}|Amount:${amount}|User:${evmAddress}`;
            signature = await walletClient.signMessage({
              account: evmAddress,
              message: commitMsg
            });
            setFakeSignature(signature);
          } else {
            setFakeSignature('Wallet not available');
            throw new Error('Wallet not available for signing');
          }
        } catch (err) {
          console.error('Signature failed:', err);
          setFakeSignature('Signature failed or rejected');
          throw new Error('ERC20 commit signing failed or rejected by user');
        }
        
        // After signature is obtained, proceed with swap
        // 1. Approve tokens
        const approvalTx = await approveToken(amount);
        console.log('Token approval transaction:', approvalTx);
        
        // 2. Lock tokens in Etherlink HTLC
        // Use 24 hours for timelock
        const timelock = Math.floor(Date.now() / 1000) + 86400;
        const lockTx = await lockEtherlinkTokens(
          amount,
          swapHash as `0x${string}`,
          timelock,
          evmAddress
        );
        
        setTransactionHash(lockTx);
        setSwapStatus('completed');
      } else if (sourceChain === 'near' && targetChain === 'etherlink') {
        // NEAR -> Etherlink
        if (!signedAccountId || !evmAddress) {
          throw new Error('Both wallets must be connected');
        }
        
        // Lock tokens in NEAR HTLC
        // Use 24 hours for timelock
        const timelock = Math.floor(Date.now() / 1000) + 86400;
        const lockTx = await nearContract.lockTokens(
          amount,
          swapHash,
          timelock,
          evmAddress
        );
        
        setTransactionHash(lockTx);
        setSwapStatus('completed');
      }
    } catch (error) {
      console.error('Swap failed:', error);
      setSwapStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setAmount('');
    setTransactionHash(null);
    setSwapStatus('idle');
    setAuctionNonce(0);
    setFakeSignature('');
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-6 pt-24">
      {/* Header */}
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          $UNREAL <span className="text-primary">Cross-Chain</span> Swap
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Seamlessly swap between Etherlink and NEAR chains
        </p>
      </div>
      
      {/* Main Swap Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Swap</h2>
        </div>
        
        {/* Card Body */}
        <div className="p-6">
          {/* Source Chain Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex-1">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent border-none text-2xl font-semibold focus:outline-none text-gray-900 dark:text-white"
                  disabled={isLoading || swapStatus === 'pending'}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ~$0.00 USD
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <Image
                    src={sourceChain === 'near' ? '/near-logo.svg' : UnrealLogoPath}
                    alt={sourceChain === 'near' ? 'NEAR' : 'Etherlink'}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">UNREAL</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    on {ChainConfigs[sourceChain].name}
                    {sourceChain === 'etherlink' && evmAddress && (
                      <span className="ml-1">({etherlinkBalance})</span>
                    )}
                    {sourceChain === 'near' && signedAccountId && (
                      <span className="ml-1">({nearBalance})</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={handleSwapChains}
              disabled={isLoading || swapStatus === 'pending'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
          
          {/* Target Chain Output */}
          <div className="mt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex-1">
                <input
                  type="text"
                  value={amount}
                  className="w-full bg-transparent border-none text-2xl font-semibold focus:outline-none text-gray-900 dark:text-white"
                  disabled={true}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ~$0.00 USD
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <Image
                    src={targetChain === 'near' ? '/near-logo.svg' : UnrealLogoPath}
                    alt={targetChain === 'near' ? 'NEAR' : 'Etherlink'}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">UNREAL</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    on {ChainConfigs[targetChain].name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Display */}
          {swapStatus === 'completed' && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl">
              <div className="flex items-center text-green-700 dark:text-green-400">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Swap initiated!</span>
              </div>
              {transactionHash && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-300">
                  Transaction: {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                </div>
              )}
              <div className="mt-2 text-sm text-green-600 dark:text-green-300">
                <p>For demo purposes, here is the generated secret:</p>
                <code className="block p-2 mt-1 bg-green-100 dark:bg-green-900/40 rounded overflow-auto text-xs">
                  {swapSecret}
                </code>
                <p className="mt-1">Keep this secret secure! It's needed to complete the swap on the target chain.</p>
              </div>
            </div>
          )}
          
          {swapStatus === 'failed' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl">
              <div className="flex items-center text-red-700 dark:text-red-400">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Swap failed. Please try again.</span>
              </div>
            </div>
          )}

          {/* Price Quote Info */}
          <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl">
            <div className="flex justify-between mb-1">
              <span>Exchange Rate</span>
              <span>1 UNREAL = 1 UNREAL</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Network Fee</span>
              <span>~0.01 {sourceChain === 'near' ? 'NEAR' : 'TEZ'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Expected Output</span>
              <div>
                {quoteLoading ? (
                  <span className="text-sm text-gray-500 animate-pulse">Loading quote...</span>
                ) : sourceChain === 'etherlink' && swapQuote ? (
                  <span>{swapQuote} UNREAL <span className="text-xs text-green-500">(via 1inch)</span></span>
                ) : (
                  <span>{amount || '0'} UNREAL</span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Connected Accounts</span>
              <span className="flex flex-col text-right">
                <span className="text-xs">{evmAddress ? `${evmAddress.slice(0,6)}...${evmAddress.slice(-4)}` : 'No EVM wallet'}</span>
                <span className="text-xs">{signedAccountId || 'No NEAR wallet'}</span>
              </span>
            </div>
          </div>
          
          {/* Swap Button */}
          {(!signedAccountId && !evmAddress) ? (
            <button
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={() => signIn()}
            >
              Connect Wallets
            </button>
          ) : swapStatus === 'completed' || swapStatus === 'failed' ? (
            <button
              className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-xl transition-colors focus:outline-none"
              onClick={handleReset}
            >
              Reset
            </button>
          ) : (
            <button
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
              onClick={handleSwap}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  <span>Swapping...</span>
                </div>
              ) : (
                "Swap"
              )}
            </button>
          )}
        </div>
      </div>
      {/* Dutch Auction Box after swap completion */}
      {swapStatus === 'completed' && (
        <DutchAuctionBox
          tokenAddress={EtherlinkContracts.unrealToken}
          nonce={auctionNonce}
          amount={amount}
          user={evmAddress || ''}
          fakeSignature={fakeSignature}
        />
      )}
    </div>
  );
}
