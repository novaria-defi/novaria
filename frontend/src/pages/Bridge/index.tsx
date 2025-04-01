import { useState, useEffect } from "react"
import ArrowSwapIcon from "@/components/icon/ArrowSwapIcon"
import { Input } from "@/components/ui/Input"
import { useAccount } from "wagmi"
import { NovariaTokenLogo } from "@/components/ui/Input"
import { useBridge } from "@/hooks/useBridge"
import Preloader from "@/components/Preloader"
import { toast } from "sonner"

export const Bridge = () => {
  const [amount, setAmount] = useState("")
  const [minReceived, setMinReceived] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const balance = 2.9422 // TODO: Get balance from wallet
  const { address } = useAccount()

  const { isBridgePending, isBridgeConfirming, isBridgeConfirmed, handleBridge } = useBridge()

  useEffect(() => {
    if (address) {
      setRecipientAddress(address)
    } else {
      setRecipientAddress("Please connect your wallet")
    }
  }, [address])

  useEffect(() => {
    if (isBridgeConfirmed) {
      toast.success("Bridge transaction successful")
    } else {
      toast.error("Bridge transaction failed")
    }
  }, [isBridgeConfirmed])

  const callBridge = () => {
    if (!address) {
      toast.error("Please connect your wallet")
    }

    if (amount && minReceived) {
      handleBridge(amount, minReceived)
    } else {
      toast.error("Please fill all the fields")
    }
  }

  return (
    <>
      {isBridgePending && <Preloader />}

      <div className="flex flex-col gap-4 max-w-[500px] mx-auto mt-12">
        {/* Main Bridge Card */}
        <div className="rounded-3xl p-5 flex flex-col gap-6 bg-zinc-900 border border-main/10">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3 bg-zinc-800 rounded-xl px-6 py-3 hover:bg-zinc-700">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img src="/src/assets/arb_logo.svg" alt="Arbitrum" className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-white/70">From</span>
                <span className="text-lg font-semibold">Arbitrum</span>
              </div>
            </div>

            <div className="rotate-90 scale-y-[-1]">
              <ArrowSwapIcon />
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 rounded-xl px-6 py-3 hover:bg-zinc-700">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img
                  src="/src/assets/liberichain_logo.png"
                  alt="Liberichain"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white/70">To</span>
                <span className="text-lg font-semibold">Liberichain</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Token Input */}
            <div className="flex flex-col gap-2 w-1/3">
              <span className="text-sm text-white/70">Token</span>
              <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4 py-2">
                <NovariaTokenLogo type="YT" />
              </div>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Amount</span>
                <span className="text-sm text-white/70">My balance: {balance}</span>
              </div>
              <div className="flex gap-2 bg-zinc-800 rounded-xl px-4 py-3">
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 bg-transparent border-0 p-0"
                />
                <button className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600">
                  Max
                </button>
              </div>
            </div>
          </div>

          {/* Min Received Input */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Min received</span>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 bg-zinc-800 rounded-xl px-4 py-3">
                <Input
                  type="number"
                  value={minReceived}
                  onChange={e => setMinReceived(e.target.value)}
                  className="flex-1 bg-transparent border-0 p-0"
                />
              </div>
              {Number(minReceived) > Number(amount) && (
                <span className="text-red-500 text-sm">
                  Min received cannot be greater than amount
                </span>
              )}
            </div>
          </div>

          {/* Recipient Address */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-white/70">Recipient address</span>
            </div>
            <div className="flex gap-2">
              <div className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white/90">
                {recipientAddress}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-3 rounded-xl transition-colors"
            onClick={() => callBridge()}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  )
}
