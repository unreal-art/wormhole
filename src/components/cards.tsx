import Link from 'next/link';

// We'll replace the module.css with Tailwind classes directly

export const Cards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      <Link
        href="https://docs.near.org/build/web3-apps/quickstart"
        className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-between">
          NEAR Docs <span className="text-primary">→</span>
        </h2>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Learn how this application works, and what you can build on NEAR.
        </p>
      </Link>

      <Link
        href="/hello-near"
        className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
        rel="noopener noreferrer"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-between">
          NEAR Integration <span className="text-primary">→</span>
        </h2>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Discover how simple it is to interact with a NEAR smart contract.
        </p>
      </Link>
      
      <Link
        href="/swap"
        className="block p-6 bg-gradient-to-r from-primary/90 to-accent/90 border border-gray-200 rounded-lg shadow hover:from-primary hover:to-accent dark:border-gray-700 transition-all duration-300 transform hover:scale-105"
        rel="noopener noreferrer"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-white flex items-center justify-between">
          UNREAL Swap <span className="text-white">→</span>
        </h2>
        <p className="font-normal text-white/90">
          Swap $UNREAL tokens between Etherlink and NEAR chains seamlessly.
        </p>
      </Link>
    </div>
  );
};
