import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useWalletSelector } from "@near-wallet-selector/react-hook"

export const Navigation = () => {
  const { signedAccountId, signIn, signOut } = useWalletSelector()
  const [action, setAction] = useState<() => void>(() => {})
  const [label, setLabel] = useState<string>("Loading...")

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => signOut)
      setLabel(`Logout ${signedAccountId}`)
    } else {
      setAction(() => signIn)
      setLabel("Login")
    }
  }, [signedAccountId, signIn, signOut])

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
        <div className="flex md:order-2">
          <button
            onClick={action}
            className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-400/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:scale-105"
          >
            {label}
          </button>
        </div>
      </div>
    </nav>
  )
}
