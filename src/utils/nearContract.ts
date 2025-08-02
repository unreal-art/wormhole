import { NetworkId, NearContracts } from '@/config';
import * as nearAPI from 'near-api-js';
import { useWalletSelector } from '@near-wallet-selector/react-hook';

// Contract IDs
const NEAR_TOKEN_CONTRACT = NearContracts.token;
const NEAR_HTLC_CONTRACT = NearContracts.htlc;

// NEAR Contract Interface
export interface NearContractMethods {
  getTokenBalance: (accountId: string) => Promise<string>;
  lockTokens: (amount: string, hash: string, timelock: number, recipient: string) => Promise<string>;
  withdrawTokens: (id: string, secret: string) => Promise<string>;
  refundTokens: (id: string) => Promise<string>;
}

/**
 * Hook to interact with NEAR contracts
 */
export function useNearContract(): NearContractMethods {
  const { viewFunction, callFunction, signedAccountId } = useWalletSelector();

  /**
   * Get UNREAL token balance for an account
   */
  const getTokenBalance = async (accountId: string): Promise<string> => {
    try {
      const balance = await viewFunction({
        contractId: NEAR_TOKEN_CONTRACT,
        method: 'ft_balance_of',
        args: { account_id: accountId }
      });
      
      return balance;
    } catch (error) {
      console.error('Error getting NEAR token balance:', error);
      return '0';
    }
  };

  /**
   * Lock tokens in the HTLC contract
   */
  const lockTokens = async (
    amount: string,
    hash: string,
    timelock: number,
    recipient: string
  ): Promise<string> => {
    if (!signedAccountId) {
      throw new Error('Not signed in');
    }

    try {
      // First approve the HTLC contract to spend tokens
      const approveResult = await callFunction({
        contractId: NEAR_TOKEN_CONTRACT,
        method: 'ft_transfer_call',
        args: {
          receiver_id: NEAR_HTLC_CONTRACT,
          amount,
          msg: JSON.stringify({
            action: 'lock',
            hash,
            timelock: timelock.toString(),
            recipient
          })
        },
        gas: '300000000000000', // 300 Tgas
        deposit: '1' // 1 yoctoNEAR for storage
      });

      return approveResult.transaction_outcome.id;
    } catch (error) {
      console.error('Error locking tokens:', error);
      throw error;
    }
  };

  /**
   * Withdraw tokens from the HTLC contract
   */
  const withdrawTokens = async (id: string, secret: string): Promise<string> => {
    if (!signedAccountId) {
      throw new Error('Not signed in');
    }

    try {
      const result = await callFunction({
        contractId: NEAR_HTLC_CONTRACT,
        method: 'withdraw',
        args: { id, secret },
        gas: '300000000000000', // 300 Tgas
      });

      return result.transaction_outcome.id;
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      throw error;
    }
  };

  /**
   * Refund tokens from the HTLC contract
   */
  const refundTokens = async (id: string): Promise<string> => {
    if (!signedAccountId) {
      throw new Error('Not signed in');
    }

    try {
      const result = await callFunction({
        contractId: NEAR_HTLC_CONTRACT,
        method: 'refund',
        args: { id },
        gas: '300000000000000', // 300 Tgas
      });

      return result.transaction_outcome.id;
    } catch (error) {
      console.error('Error refunding tokens:', error);
      throw error;
    }
  };

  return {
    getTokenBalance,
    lockTokens,
    withdrawTokens,
    refundTokens
  };
}
