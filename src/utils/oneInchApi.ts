import { EtherlinkChainId } from '@/config';

/**
 * 1inch Fusion API integration for better token swap quotes and routing
 * Documentation: https://docs.1inch.io/docs/fusion-swap/api
 */

const ONEINCH_API_BASE = 'https://api.1inch.dev';

// Interfaces for 1inch API responses
interface OneInchQuoteResponse {
  toAmount: string;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  protocols: any[];
  estimatedGas: number;
}

interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

interface OneInchSwapResponse {
  toAmount: string;
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: number;
  };
}

/**
 * Get a quote for swapping tokens using 1inch API
 * @param fromTokenAddress Source token address
 * @param toTokenAddress Destination token address
 * @param amount Amount in wei to swap
 * @param apiKey 1inch API key
 * @returns Quote information including estimated output amount
 */
export const getSwapQuote = async (
  fromTokenAddress: string, 
  toTokenAddress: string, 
  amount: string,
  apiKey: string
): Promise<OneInchQuoteResponse> => {
  try {
    const url = new URL(`${ONEINCH_API_BASE}/fusion/quote`);
    
    url.searchParams.append('src', fromTokenAddress);
    url.searchParams.append('dst', toTokenAddress);
    url.searchParams.append('amount', amount);
    url.searchParams.append('chainId', EtherlinkChainId.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as OneInchQuoteResponse;
  } catch (error) {
    console.error('Error getting 1inch quote:', error);
    throw error;
  }
};

/**
 * Build a swap transaction using 1inch API
 * @param fromTokenAddress Source token address
 * @param toTokenAddress Destination token address
 * @param amount Amount in wei to swap
 * @param fromAddress User's wallet address
 * @param slippage Maximum acceptable slippage percentage (0.1 = 0.1%)
 * @param apiKey 1inch API key
 * @returns Swap transaction data
 */
export const buildSwapTransaction = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  fromAddress: string,
  slippage: number = 0.5,
  apiKey: string
): Promise<OneInchSwapResponse> => {
  try {
    const url = new URL(`${ONEINCH_API_BASE}/fusion/swap`);
    
    url.searchParams.append('src', fromTokenAddress);
    url.searchParams.append('dst', toTokenAddress);
    url.searchParams.append('amount', amount);
    url.searchParams.append('from', fromAddress);
    url.searchParams.append('slippage', slippage.toString());
    url.searchParams.append('chainId', EtherlinkChainId.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as OneInchSwapResponse;
  } catch (error) {
    console.error('Error building 1inch swap:', error);
    throw error;
  }
};

/**
 * Check the status of a 1inch order
 * @param orderId Order ID to check
 * @param apiKey 1inch API key
 * @returns Order status information
 */
export const checkOrderStatus = async (
  orderId: string,
  apiKey: string
): Promise<any> => {
  try {
    const url = `${ONEINCH_API_BASE}/fusion/orders/${orderId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking 1inch order status:', error);
    throw error;
  }
};

/**
 * Helper function to format token amounts for display
 * @param amount Raw token amount in wei
 * @param decimals Token decimals
 * @returns Formatted token amount as string
 */
export const formatTokenAmount = (amount: string, decimals: number): string => {
  const value = BigInt(amount);
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  // Format fractional part with leading zeros
  let fractionalString = fractionalPart.toString().padStart(decimals, '0');
  
  // Trim trailing zeros
  fractionalString = fractionalString.replace(/0+$/, '');
  
  if (fractionalString) {
    return `${integerPart}.${fractionalString}`;
  }
  
  return integerPart.toString();
};
