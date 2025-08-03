import React from 'react';

interface DutchAuctionBoxProps {
  tokenAddress: string;
  nonce: number;
  amount: string;
  user: string;
  fakeSignature: string;
}

export const DutchAuctionBox: React.FC<DutchAuctionBoxProps> = ({ tokenAddress, nonce, amount, user, fakeSignature }) => {
  return (
    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl mt-8">
      <h2 className="text-lg font-bold mb-2 text-yellow-800 dark:text-yellow-200">Dutch Auction Commit</h2>
      <div className="mb-2 text-sm text-yellow-900 dark:text-yellow-100">
        <b>Token:</b> <span className="font-mono">{tokenAddress}</span>
      </div>
      <div className="mb-2 text-sm text-yellow-900 dark:text-yellow-100">
        <b>ERC20 Nonce:</b> <span className="font-mono">{nonce}</span>
      </div>
      <div className="mb-2 text-sm text-yellow-900 dark:text-yellow-100">
        <b>Amount:</b> <span className="font-mono">{amount}</span>
      </div>
      <div className="mb-2 text-sm text-yellow-900 dark:text-yellow-100">
        <b>User:</b> <span className="font-mono">{user}</span>
      </div>
      <div className="mb-2 text-sm text-yellow-900 dark:text-yellow-100">
        <b>Fake Signature:</b> <span className="font-mono break-all">{fakeSignature}</span>
      </div>
      <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">(This is a simulated commit for demo purposes.)</div>
    </div>
  );
};
