import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWalletSelector } from '@near-wallet-selector/react-hook';

export const Navigation = () => {
  const { signedAccountId, signIn, signOut } = useWalletSelector();
  const [action, setAction] = useState<() => void>(() => {});
  const [label, setLabel] = useState<string>('Loading...');

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => signIn);
      setLabel('Login');
    }
  }, [signedAccountId, signIn, signOut]);

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <Image 
              priority 
              src="/unreal-logo.svg" 
              alt="UNREAL" 
              width={30} 
              height={30} 
              className="mr-3" 
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              UNREAL Swap
            </span>
          </Link>
          <Link href="/swap" className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
            Swap
          </Link>
        </div>
        <div className="flex md:order-2">
          <button 
            onClick={action} 
            className="text-white bg-gradient-to-r from-primary to-accent hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
