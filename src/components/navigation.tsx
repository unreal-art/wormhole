import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useWalletSelector } from "@near-wallet-selector/react-hook"
import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useDisconnect } from "wagmi"

export const Navigation = () => {
  // NEAR wallet handling
  const { signedAccountId, signIn, signOut } = useWalletSelector()
  const [nearAction, setNearAction] = useState<() => void>(() => {})
  const [nearLabel, setNearLabel] = useState<string>("Loading...")
  
  // Ethereum wallet handling with wagmi/web3modal
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [ethLabel, setEthLabel] = useState<string>("Connect ETH")

  // Set up NEAR wallet connection button behavior
  useEffect(() => {
    if (signedAccountId) {
      setNearAction(() => signOut)
      setNearLabel(`NEAR: ${signedAccountId.substring(0, 6)}...`)
    } else {
      setNearAction(() => signIn)
      setNearLabel("Connect NEAR")
    }
  }, [signedAccountId, signIn, signOut])

  // Handle Ethereum wallet connection display
  useEffect(() => {
    if (isConnected && address) {
      setEthLabel(`ETH: ${address.substring(0, 6)}...`)
    } else {
      setEthLabel("Connect ETH")
    }
  }, [isConnected, address])

  return (
    <nav className="bg-indigo-950/80 backdrop-blur-md fixed w-full z-20 top-0 left-0 border-b border-purple-500/30 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <Image
              priority
              src="/logo.webp"
              alt="UNREAL"
              width={30}
              height={30}
              className="mr-3"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              UNREAL Swap
            </span>
          </Link>
          <Link
            href="/swap"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Swap
          </Link>
        </div>
        <div className="flex md:order-2 space-x-3">
          {/* NEAR Wallet Button */}
          <button
            onClick={nearAction}
            className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-400/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-105"
          >
            {nearLabel}
          </button>

          {/* Ethereum Wallet Button with wagmi/web3modal */}
          <button
            onClick={() => isConnected ? disconnect() : open()}
            className="text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-400/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:scale-105"
          >
            {ethLabel}
          </button>
        </div>
      </div>
    </nav>
  )
}
