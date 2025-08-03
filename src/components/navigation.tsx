import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useWalletSelector } from "@near-wallet-selector/react-hook"
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react"

export const Navigation = () => {
  // NEAR wallet handling
  const { signedAccountId, signIn, signOut } = useWalletSelector()
  const [nearAction, setNearAction] = useState<() => void>(() => {})
  const [nearLabel, setNearLabel] = useState<string>("Loading...")
  
  // Ethereum wallet handling with thirdweb
  const ethAddress = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (signedAccountId) {
      setNearAction(() => signOut)
      setNearLabel(`NEAR: ${signedAccountId.substring(0, 6)}...`)

  useEffect(() => {
    // Check if Ethereum wallet is connected
    const checkEthConnection = async () => {
      try {
        // Get the current state
        const { wagmi } = await wagmiAdapter.getContext()
        const accounts = await wagmi.getAccounts()
        const connectedAddress = accounts[0] || ""

        if (connectedAddress) {
          setEthConnected(true)
          // Format the address to show only first 6 chars
          setEthAddress(`ETH: ${connectedAddress.substring(0, 6)}...`)
        } else {
          setEthConnected(false)
          setEthAddress("")
        }
      } catch (error) {
        console.error("Error checking Ethereum wallet connection:", error)
        setEthConnected(false)
        setEthAddress("")
      }
    }

    checkEthConnection()

    // Subscribe to connection events
    const unsubscribe = web3Modal.subscribeEvents(() => {
      // Any event triggers a recheck of connection status
      checkEthConnection()
    })

    return () => unsubscribe()
  }, [])

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

          {/* Ethereum Wallet Button with thirdweb */}
          <ConnectWallet 
            theme="dark"
            btnTitle="Connect ETH"
            modalTitle="Connect Ethereum Wallet"
            modalSize="wide"
            welcomeScreen={{
              title: "UNREAL Swap",
              subtitle: "Connect your Ethereum wallet to use the swap functionality"
            }}
            modalTitleIconUrl="/logo.webp"
            className="!bg-gradient-to-r !from-blue-600 !to-teal-500 !hover:from-blue-700 !hover:to-teal-600 !rounded-lg !text-sm !px-5 !py-2.5 !transition-all !duration-200 !shadow-lg !shadow-teal-500/20 !hover:shadow-teal-500/40 !transform !hover:scale-105"
          />
        </div>
      </div>
    </nav>
  )
}
