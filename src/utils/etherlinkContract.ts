import { 
  createPublicClient, 
  createWalletClient, 
  custom, 
  http, 
  parseAbi, 
  parseEther, 
  parseUnits, 
  formatUnits 
} from 'viem';
import { ETHERLINK_CHAIN, EtherlinkContracts } from '@/config';

// Use shared Etherlink chain definition from config
const etherlinkChain = ETHERLINK_CHAIN;

// ABIs for the contracts
const tokenAbi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);

const htlcAbi = parseAbi([
  'function lockToken(address token, uint256 amount, bytes32 hash, uint256 timelock, address recipient) returns (bytes32)',
  'function withdraw(bytes32 id, bytes32 secret) returns (bool)',
  'function refund(bytes32 id) returns (bool)',
  'function getLock(bytes32 id) view returns (address, address, address, uint256, bytes32, uint256, bool)',
]);

// Create a public client for read operations
export const publicClient = createPublicClient({
  chain: etherlinkChain,
  transport: http(),
});

// Create a wallet client using window.ethereum when available
export const getWalletClient = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return createWalletClient({
      chain: etherlinkChain,
      transport: custom(window.ethereum),
    });
  }
  return null;
};

// Token Contract interactions
export const etherlinkTokenContract = {
  address: EtherlinkContracts.unrealToken as `0x${string}`,
  abi: tokenAbi,
};

// HTLC Contract interactions
export const etherlinkHtlcContract = {
  address: EtherlinkContracts.unrealHTLC as `0x${string}`,
  abi: htlcAbi,
};

// Helper functions
export const getTokenBalance = async (address: `0x${string}`) => {
  try {
    const balance = await publicClient.readContract({
      ...etherlinkTokenContract,
      functionName: 'balanceOf',
      args: [address],
    });
    
    const decimals = await publicClient.readContract({
      ...etherlinkTokenContract,
      functionName: 'decimals',
    });
    
    return {
      raw: balance,
      formatted: formatUnits(balance as bigint, decimals as number),
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    return { raw: 0n, formatted: '0' };
  }
};

export const checkAllowance = async (owner: `0x${string}`, spender: `0x${string}`) => {
  try {
    const allowance = await publicClient.readContract({
      ...etherlinkTokenContract,
      functionName: 'allowance',
      args: [owner, spender],
    });
    
    const decimals = await publicClient.readContract({
      ...etherlinkTokenContract,
      functionName: 'decimals',
    });
    
    return {
      raw: allowance,
      formatted: formatUnits(allowance as bigint, decimals as number),
    };
  } catch (error) {
    console.error('Error checking allowance:', error);
    return { raw: 0n, formatted: '0' };
  }
};

export const approveToken = async (amount: string) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error('Wallet not connected');
  
  const [address] = await walletClient.getAddresses();
  
  const decimals = await publicClient.readContract({
    ...etherlinkTokenContract,
    functionName: 'decimals',
  });
  
  const parsedAmount = parseUnits(amount, decimals as number);
  
  const hash = await walletClient.writeContract({
    ...etherlinkTokenContract,
    functionName: 'approve',
    args: [etherlinkHtlcContract.address, parsedAmount],
  });
  
  return hash;
};

export const lockTokens = async (amount: string, hash: `0x${string}`, timelock: number, recipient: `0x${string}`) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error('Wallet not connected');
  
  const decimals = await publicClient.readContract({
    ...etherlinkTokenContract,
    functionName: 'decimals',
  });
  
  const parsedAmount = parseUnits(amount, decimals as number);
  
  const lockHash = await walletClient.writeContract({
    ...etherlinkHtlcContract,
    functionName: 'lockToken',
    args: [etherlinkTokenContract.address, parsedAmount, hash, BigInt(timelock), recipient],
  });
  
  return lockHash;
};

export const withdrawTokens = async (id: `0x${string}`, secret: `0x${string}`) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error('Wallet not connected');
  
  const hash = await walletClient.writeContract({
    ...etherlinkHtlcContract,
    functionName: 'withdraw',
    args: [id, secret],
  });
  
  return hash;
};

export const refundTokens = async (id: `0x${string}`) => {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error('Wallet not connected');
  
  const hash = await walletClient.writeContract({
    ...etherlinkHtlcContract,
    functionName: 'refund',
    args: [id],
  });
  
  return hash;
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
