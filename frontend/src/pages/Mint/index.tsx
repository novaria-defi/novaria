import ArrowDownIcon from "@/components/icon/ArrowDownIcon"
import ClockIcon from "@/components/icon/ClockIcon"
import FuelIcon from "@/components/icon/FuelIcon"
import PercentIcon from "@/components/icon/Percent"
import Preloader from "@/components/Preloader"
import { Input, NovariaTokenLogo, WBTCTokenLogo } from "@/components/ui/Input"
import { mockWBTCAbi } from "@/lib/abis/mockWbtcAbi"
import { novariaAbi } from "@/lib/abis/NovariaAbi"
import { NOVARIA_CA, WBTC_CA } from "@/utils/constants"
import { separateByDot } from "@/utils/helper"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi"

const EXECUTION_FEE = 1e16

export const Mint = () => {
  const [mintAmount, setMintAmount] = useState<number>(0)
  const mintAmountValue = useRef<number>(0)

  useEffect(() => {
    mintAmountValue.current = mintAmount
  }, [mintAmount])

  const { address } = useAccount()

  const { data: mockBalance } = useReadContract({
    abi: mockWBTCAbi,
    address: WBTC_CA,
    functionName: "balanceOf",
    args: [address],
  })

  const {
    data: transactionHash,
    isPending: isPendingTransaction,
    writeContractAsync,
  } = useWriteContract()

  const { isLoading, isSuccess: _ } = useWaitForTransactionReceipt({
    hash: transactionHash,
  })

  const handleMintAndApprove = async () => {
    // Approve
    writeContractAsync({
      abi: mockWBTCAbi,
      address: WBTC_CA,
      functionName: "approve",
      args: [NOVARIA_CA, mintAmountValue.current],
    })
      .then(async () => {
        // Mint
        const res = await writeContractAsync({
          address: NOVARIA_CA,
          abi: novariaAbi,
          functionName: "createOrder",
          args: [mintAmountValue.current, WBTC_CA, 5n, true],
          value: BigInt(EXECUTION_FEE),
        })

        toast.success(`Success Mint. Trx ID: ${res} 🪙🪙🪙`)
        setMintAmount(0)
      })
      .catch(err => {
        console.error(err)
        toast.error("Errror Mint Token")
      })
  }

  return (
    <>
      {(isPendingTransaction || isLoading) && <Preloader />}

      <div className="rounded-3xl p-5 flex flex-col gap-6 items-center justify-center mt-12 bg-zinc-900 w-[400px] mx-auto border border-main/10">
        <div className="flex flex-col gap-1">
          <div className="text-start w-full text-lg font-semibold">Input</div>
          <Input
            icon={<WBTCTokenLogo />}
            type="number"
            value={mintAmount}
            onChange={ev => {
              const value = ev.target.value
              const currentBalance = Number(mockBalance) / 1e18 - Number(value)

              if (currentBalance < 0) {
                return
              }
              setMintAmount(Number(value))
            }}
          />
          <p className="text-xs text-white/50">
            Your Balance {separateByDot(Number(mockBalance ?? 0) / 1e18)} WBTC
          </p>
        </div>

        <div className="bg-turquoise-100 text-black rounded-full p-2">
          <ArrowDownIcon />
        </div>

        <div>
          <div className="text-start w-full text-lg font-semibold mb-2">Output</div>
          <Input icon={<NovariaTokenLogo />} type="number" value={mintAmount / 10} />
        </div>

        <div className="w-full">
          <div className="p-2 w-full rounded-2xl flex items-center justify-between">
            <span className="flex gap-2 text-white/50">
              <ClockIcon />
              <p className="text-sm">Est. Processing Time</p>
            </span>

            <p className="text-sm">~5 s</p>
          </div>
          <div className="p-2 w-full rounded-2xl flex items-center justify-between">
            <span className="flex gap-2 text-white/50">
              <FuelIcon />
              <p className="text-sm">Network Fee</p>
            </span>

            <p className="text-sm">0.001</p>
          </div>
          <div className="p-2 w-full rounded-2xl flex items-center justify-between">
            <span className="flex gap-2 text-white/50">
              <PercentIcon />
              <p className="text-sm">Current Funding Rate</p>
            </span>

            <p className="text-sm">10%</p>
          </div>
        </div>

        <button
          className="w-full border border-main/50 bg-main/10 px-4 py-2 rounded-lg text-sm text-white cursor-pointer hover:border-main hover:bg-main/40 transition-all disabled:opacity-50"
          onClick={handleMintAndApprove}
          disabled={mintAmount < 1}
        >
          Mint
        </button>
      </div>
    </>
  )
}
