import Image from 'next/image';
import NearLogo from '/public/near.svg';
import NextLogo from '/public/next.svg';
import { Cards } from '@/components/cards';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 pt-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-primary">UNREAL</span> Cross-Chain Swap
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg mb-8">
          Seamlessly swap $UNREAL tokens between Etherlink and NEAR chains
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-primary after:via-accent after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-primary/10 after:dark:from-primary/10 after:dark:via-accent/30 before:lg:h-[360px] mb-8">
        <div className="flex items-center gap-4">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition-all duration-300 hover:scale-110"
            src={NearLogo}
            alt="NEAR Logo"
            width={165}
            height={42}
            priority
          />
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">+</div>
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition-all duration-300 hover:scale-110"
            src={NextLogo}
            alt="Next.js Logo"
            width={174}
            height={35}
            priority
          />
        </div>
      </div>

      <Cards />
    </main>
  );
}
